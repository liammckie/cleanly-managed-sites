import { supabase } from './supabase';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';

// Types for database records
export interface SiteRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  status: 'active' | 'inactive' | 'pending';
  representative: string;
  phone?: string;
  email?: string;
  created_at?: string;
  user_id?: string;
}

// Site API functions
export const sitesApi = {
  // Get all sites for the current user
  async getSites(): Promise<SiteRecord[]> {
    const { data: sites, error } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sites:', error);
      throw error;
    }
    
    return sites || [];
  },
  
  // Get a single site by ID
  async getSiteById(id: string): Promise<SiteRecord | null> {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching site with ID ${id}:`, error);
      throw error;
    }
    
    return data;
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
    
    return data;
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
    
    return data;
  },
  
  // Delete a site
  async deleteSite(id: string): Promise<void> {
    // First delete related subcontractors
    await supabase
      .from('subcontractors')
      .delete()
      .eq('site_id', id);
    
    // Then delete the site
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

// Subcontractor API functions
export const subcontractorsApi = {
  // Get all subcontractors for a site
  async getSubcontractors(siteId: string) {
    const { data, error } = await supabase
      .from('subcontractors')
      .select('*')
      .eq('site_id', siteId);
    
    if (error) {
      console.error(`Error fetching subcontractors for site ${siteId}:`, error);
      throw error;
    }
    
    return data || [];
  }
};

// Auth API functions
export const authApi = {
  // Get the current authenticated user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
    
    return user;
  },
  
  // Check if a user is authenticated
  async isAuthenticated() {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  },
  
  // Sign out the current user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
};
