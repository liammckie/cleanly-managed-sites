
import { supabase } from '@/integrations/supabase/client';
import { SiteRecord, ContactRecord } from '../types';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';

// Site API functions
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
        clients: undefined // Remove the clients property
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
        contacts: [] as ContactRecord[] // Initialize with empty array
      };
      
      // Get contacts for the site separately
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('entity_id', id)
        .eq('entity_type', 'site');
      
      if (contactsError) {
        console.error(`Error fetching contacts for site ${id}:`, contactsError);
      } else if (contactsData) {
        // Add the contacts to the transformed data
        transformedData.contacts = contactsData as ContactRecord[];
      }
      
      return transformedData as SiteRecord;
    }
    
    return null;
  },
  
  // Get contacts for a site
  async getSiteContacts(siteId: string): Promise<ContactRecord[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('entity_id', siteId)
      .eq('entity_type', 'site')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching contacts for site ${siteId}:`, error);
      throw error;
    }
    
    return data as ContactRecord[] || [];
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
    
    // If there are subcontractors, store them separately
    if (siteData.subcontractors.length > 0) {
      const subcontractorRecords = siteData.subcontractors.map(sub => ({
        site_id: data.id,
        business_name: sub.businessName,
        contact_name: sub.contactName,
        email: sub.email,
        phone: sub.phone,
        user_id: user.id,
      }));
      
      const { error: subError } = await supabase
        .from('subcontractors')
        .insert(subcontractorRecords);
      
      if (subError) {
        console.error('Error inserting subcontractors:', subError);
        // We won't throw here to avoid rolling back the site creation
      }
    }
    
    // If there are contacts, store them
    if (siteData.contacts && siteData.contacts.length > 0) {
      const contactRecords = siteData.contacts.map(contact => ({
        name: contact.name,
        role: contact.role,
        department: contact.department || null,
        email: contact.email || null,
        phone: contact.phone || null,
        is_primary: contact.is_primary || false,
        notes: contact.notes || null,
        entity_id: data.id,
        entity_type: 'site',
        user_id: user.id
      }));
      
      const { error: contactError } = await supabase
        .from('contacts')
        .insert(contactRecords);
      
      if (contactError) {
        console.error('Error inserting contacts:', contactError);
        // We won't throw here to avoid rolling back the site creation
      }
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
    const { data, error } = await supabase
      .from('sites')
      .update({
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
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating site with ID ${id}:`, error);
      throw error;
    }
    
    // If subcontractors were provided, update them as well
    if (siteData.subcontractors) {
      // First, delete existing subcontractors for this site
      await supabase
        .from('subcontractors')
        .delete()
        .eq('site_id', id);
      
      // Then insert the new ones if there are any
      if (siteData.subcontractors.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        
        const subcontractorRecords = siteData.subcontractors.map(sub => ({
          site_id: id,
          business_name: sub.businessName,
          contact_name: sub.contactName,
          email: sub.email,
          phone: sub.phone,
          user_id: user?.id,
        }));
        
        await supabase
          .from('subcontractors')
          .insert(subcontractorRecords);
      }
    }
    
    // If contacts were provided, update them as well
    if (siteData.contacts) {
      // First, delete existing contacts for this site
      await supabase
        .from('contacts')
        .delete()
        .eq('entity_id', id)
        .eq('entity_type', 'site');
      
      // Then insert the new ones
      const { data: { user } } = await supabase.auth.getUser();
      
      const contactRecords = siteData.contacts.map(contact => ({
        name: contact.name,
        role: contact.role,
        department: contact.department || null,
        email: contact.email || null,
        phone: contact.phone || null,
        is_primary: contact.is_primary || false,
        notes: contact.notes || null,
        entity_id: id,
        entity_type: 'site',
        user_id: user?.id
      }));
      
      const { error: contactError } = await supabase
        .from('contacts')
        .insert(contactRecords);
      
      if (contactError) {
        console.error('Error updating contacts:', contactError);
      }
    }
    
    // Fetch the contacts to include in the result
    const { data: contactsData } = await supabase
      .from('contacts')
      .select('*')
      .eq('entity_id', id)
      .eq('entity_type', 'site');
    
    // Create a result that includes the contacts
    const result = {
      ...data,
      contacts: contactsData || []
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
