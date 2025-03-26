import { supabase } from '@/integrations/supabase/client';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteRecord, ClientRecord } from '@/lib/types';
import { toast } from 'sonner';

// Keep existing functions but fix the property name in this section
export const createSite = async (formData: SiteFormData): Promise<SiteRecord> => {
  try {
    console.log("Creating site with data:", formData);
    
    // Only include client_id if provided
    const clientId = formData.client_id || null;
    
    // Format the data for database insert
    const insertData: any = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postcode: formData.postalCode, // Field name mapping
      country: formData.country,
      status: formData.status || 'active',
      email: formData.email,
      phone: formData.phone,
      representative: formData.representative,
      custom_id: formData.customId, // Field name mapping
      client_id: clientId
    };
    
    // Process client name if client_id is provided
    if (clientId) {
      // Fetch client name
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('name')
        .eq('id', clientId)
        .single();
      
      if (clientError) {
        console.warn('Error fetching client name:', clientError);
      } else if (clientData) {
        insertData.client_name = clientData.name;
      }
    }
    
    // Process JSON data
    if (formData.contract_details) {
      insertData.contract_details = formData.contract_details;
    }
    
    if (formData.billingDetails) {
      insertData.billing_details = {
        ...formData.billingDetails,
        // If there are billing lines, include them
        billingLines: formData.billingDetails.billingLines || []
      };
    }
    
    if (formData.jobSpecifications) {
      insertData.job_specifications = formData.jobSpecifications;
    }
    
    if (formData.subcontractors && formData.subcontractors.length > 0) {
      insertData.has_subcontractors = true;
      // Convert field names to snake_case for database consistency
      insertData.subcontractors = formData.subcontractors.map(sub => ({
        id: sub.id,
        business_name: sub.name, // Field name mapping
        contact_name: sub.contact_name, // Field name mapping
        email: sub.email,
        phone: sub.phone,
        services: sub.services,
        is_flat_rate: sub.isFlatRate, // Field name mapping
        monthly_cost: sub.monthlyCost, // Field name mapping
        notes: sub.notes
      }));
    } else {
      insertData.has_subcontractors = false;
      insertData.subcontractors = [];
    }
    
    if (formData.replenishables) {
      insertData.replenishables = formData.replenishables;
    }
    
    if (formData.periodicals) {
      insertData.periodicals = formData.periodicals;
    }
    
    if (formData.securityDetails) {
      insertData.security_details = formData.securityDetails;
    }
    
    // Add billing metrics if provided
    if (formData.monthlyRevenue !== undefined) {
      insertData.monthly_revenue = formData.monthlyRevenue;
    }
    
    if (formData.weeklyRevenue !== undefined) {
      insertData.weekly_revenue = formData.weeklyRevenue;
    }
    
    if (formData.annualRevenue !== undefined) {
      insertData.annual_revenue = formData.annualRevenue;
    }
    
    // Insert the site into the database
    const { data, error } = await supabase
      .from('sites')
      .insert([insertData])
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating site:', error);
      throw error;
    }
    
    const createdSite = data as SiteRecord;
    
    // Process contacts if provided
    if (formData.contacts && formData.contacts.length > 0) {
      // Create contacts in the contacts table
      for (const contact of formData.contacts) {
        await supabase
          .from('contacts')
          .insert([{
            entity_id: createdSite.id,
            entity_type: "site",
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            role: contact.role,
            department: contact.department,
            notes: contact.notes,
            is_primary: contact.isPrimary // Fixed property name
          }]);
      }
    }
    
    console.log("Site created successfully:", createdSite);
    return createdSite;
  } catch (error) {
    console.error('Error in createSite:', error);
    toast.error('Failed to create site');
    throw error;
  }
};

// Get all sites
export const getSites = async (): Promise<SiteRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching sites:', error);
      throw error;
    }
    
    return data as SiteRecord[];
  } catch (error) {
    console.error('Error in getSites:', error);
    throw error;
  }
};

// Get site by ID
export const getSiteById = async (id: string): Promise<SiteRecord> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching site with ID ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`Site with ID ${id} not found`);
    }
    
    return data as SiteRecord;
  } catch (error) {
    console.error('Error in getSiteById:', error);
    throw error;
  }
};

export const getSiteWithDetails = async (siteId: string): Promise<SiteRecord> => {
  try {
    // Fetch the site with all details
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .single();
    
    if (siteError) {
      console.error('Error fetching site:', siteError);
      throw siteError;
    }
    
    // Fetch client details if client_id exists
    let client: ClientRecord | null = null;
    if (site.client_id) {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', site.client_id)
        .single();
      
      if (!clientError) {
        client = clientData;
      } else {
        console.warn('Error fetching client:', clientError);
      }
    }
    
    // Fetch contacts for the site
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('entity_id', siteId)
      .eq('entity_type', 'site');
    
    if (contactsError) {
      console.warn('Error fetching contacts:', contactsError);
    }
    
    // Combine all data
    const siteWithDetails: SiteRecord = {
      ...site,
      client: client,
      contacts: contacts || []
    };
    
    return siteWithDetails;
  } catch (error) {
    console.error('Error in getSiteWithDetails:', error);
    throw error;
  }
};

// Delete site
export const deleteSite = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting site with ID ${id}:`, error);
      throw error;
    }
    
    toast.success('Site deleted successfully');
  } catch (error) {
    console.error('Error in deleteSite:', error);
    throw error;
  }
};

export const sitesApi = {
  createSite,
  getSites,
  getSiteById,
  deleteSite,
  getSiteWithDetails
};
