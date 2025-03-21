import { supabase } from '@/integrations/supabase/client';
import { SiteRecord } from '../../types';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { getSiteContacts } from './siteContactsApi';
import { handleSiteSubcontractors } from './siteSubcontractorsApi';
import { handleSiteContacts } from './siteContactsApi';
import { contractHistoryApi } from './contractHistoryApi';

// Core Site API functions
export const sitesApi = {
  // Get all sites for the current user
  async getSites(): Promise<SiteRecord[]> {
    const { data: sites, error } = await supabase
      .from('sites')
      .select('*, clients(name, contact_name)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sites:', error);
      throw error;
    }
    
    // Transform the result to include client_name
    const transformedSites = sites.map(site => {
      const clientData = site.clients as { name: string } | null;
      return {
        ...site,
        client_name: clientData?.name || null,
        clients: undefined, // Remove the clients property
        contacts: [] // Initialize with empty contacts array
      };
    });
    
    return transformedSites as SiteRecord[];
  },
  
  // Get a single site by ID
  async getSiteById(id: string): Promise<SiteRecord | null> {
    const { data, error } = await supabase
      .from('sites')
      .select('*, clients(name, contact_name)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching site with ID ${id}:`, error);
      throw error;
    }
    
    // Transform to include client_name
    if (data) {
      const clientData = data.clients as { name: string } | null;
      const transformedData = {
        ...data,
        client_name: clientData?.name || null,
        clients: undefined, // Remove the clients property
        contacts: [] // Initialize with empty array
      };
      
      try {
        // Get contacts for the site separately
        const siteContacts = await getSiteContacts(id);
        transformedData.contacts = siteContacts;
      } catch (contactError) {
        console.error(`Error fetching contacts for site ${id}:`, contactError);
        // Keep empty contacts array if there's an error
      }
      
      return transformedData as SiteRecord;
    }
    
    return null;
  },
  
  // Create a new site
  async createSite(siteData: SiteFormData): Promise<SiteRecord> {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Prepare the site data for insertion
    const siteRecord = {
      name: siteData.name,
      address: siteData.address,
      city: siteData.city,
      state: siteData.state,
      postcode: siteData.postcode,
      status: siteData.status,
      representative: siteData.representative,
      phone: siteData.phone,
      email: siteData.email,
      user_id: user.id,
      client_id: siteData.clientId,
      monthly_cost: siteData.monthlyCost,
      monthly_revenue: siteData.monthlyRevenue,
      // Store the detailed data as JSON
      security_details: siteData.securityDetails,
      job_specifications: siteData.jobSpecifications,
      periodicals: siteData.periodicals,
      replenishables: siteData.replenishables,
      contract_details: siteData.contractDetails,
      billing_details: siteData.billingDetails,
      // If there are subcontractors, store them
      has_subcontractors: siteData.subcontractors.length > 0,
      // If custom_id exists and is not empty, use it
      ...(siteData.customId && siteData.customId.trim() !== '' ? { custom_id: siteData.customId } : {})
    };
    
    const { data, error } = await supabase
      .from('sites')
      .insert(siteRecord)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating site:', error);
      throw error;
    }
    
    // Handle subcontractors separately
    if (siteData.subcontractors.length > 0) {
      await handleSiteSubcontractors(data.id, siteData.subcontractors, user.id);
    }
    
    // Handle contacts separately
    if (siteData.contacts && siteData.contacts.length > 0) {
      await handleSiteContacts(data.id, siteData.contacts, user.id);
    }
    
    // Create a result that includes the contacts
    const result = {
      ...data,
      contacts: siteData.contacts || []
    } as SiteRecord;
    
    return result;
  },
  
  // Update an existing site
  async updateSite(id: string, siteData: Partial<SiteFormData>): Promise<SiteRecord> {
    // First, if contract details are provided, save the contract history
    if (siteData.contractDetails) {
      try {
        await contractHistoryApi.saveContractVersion(
          id, 
          siteData.contractDetails,
          'Updated via site form'
        );
      } catch (error) {
        console.error('Error saving contract history:', error);
        // Don't throw here, continue with site update
      }
    }
    
    const updateData = {
      name: siteData.name,
      address: siteData.address,
      city: siteData.city,
      state: siteData.state,
      postcode: siteData.postcode,
      status: siteData.status,
      representative: siteData.representative,
      phone: siteData.phone,
      email: siteData.email,
      client_id: siteData.clientId,
      monthly_cost: siteData.monthlyCost,
      monthly_revenue: siteData.monthlyRevenue,
      // Update the JSON fields if provided
      ...(siteData.securityDetails && { security_details: siteData.securityDetails }),
      ...(siteData.jobSpecifications && { job_specifications: siteData.jobSpecifications }),
      ...(siteData.periodicals && { periodicals: siteData.periodicals }),
      ...(siteData.replenishables && { replenishables: siteData.replenishables }),
      ...(siteData.contractDetails && { contract_details: siteData.contractDetails }),
      ...(siteData.billingDetails && { billing_details: siteData.billingDetails }),
      ...(siteData.subcontractors && { has_subcontractors: siteData.subcontractors.length > 0 }),
      // Handle custom ID updates
      ...(siteData.customId !== undefined ? 
        (siteData.customId.trim() !== '' ? { custom_id: siteData.customId } : { custom_id: null }) 
        : {})
    };
    
    const { data, error } = await supabase
      .from('sites')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating site with ID ${id}:`, error);
      throw error;
    }
    
    // Get the current user for user_id
    const { data: { user } } = await supabase.auth.getUser();
    
    // Handle subcontractors if provided
    if (siteData.subcontractors) {
      await handleSiteSubcontractors(id, siteData.subcontractors, user?.id);
    }
    
    // Handle contacts if provided
    if (siteData.contacts) {
      await handleSiteContacts(id, siteData.contacts, user?.id);
    }
    
    // Fetch the contacts to include in the result
    let contacts = [];
    try {
      contacts = await getSiteContacts(id);
    } catch (contactError) {
      console.error(`Error fetching contacts for site ${id}:`, contactError);
      // Keep empty contacts array if there's an error
    }
    
    // Create a result that includes the contacts
    const result = {
      ...data,
      contacts: contacts || []
    } as SiteRecord;
    
    return result;
  },
  
  // Delete a site
  async deleteSite(id: string): Promise<void> {
    // First delete related contacts
    await supabase
      .from('contacts')
      .delete()
      .eq('entity_id', id)
      .eq('entity_type', 'site');
    
    // Then delete related subcontractors
    await supabase
      .from('subcontractors')
      .delete()
      .eq('site_id', id);
    
    // Finally delete the site
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting site with ID ${id}:`, error);
      throw error;
    }
  }
};
