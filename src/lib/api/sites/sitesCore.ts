
import { supabase } from '@/integrations/supabase/client';
import { SiteRecord, ContactRecord } from '@/lib/types';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';

// Core site API functions for fetching site data
export const sitesCore = {
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
  
  // Delete a site and all related data
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
