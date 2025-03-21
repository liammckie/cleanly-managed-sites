
import { supabase } from '@/integrations/supabase/client';

// Define the Subcontractor type for better TypeScript support
export interface SubcontractorRecord {
  id: string;
  site_id: string;
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Subcontractor API functions
export const subcontractorsApi = {
  // Get all subcontractors for a site
  async getSubcontractors(siteId: string): Promise<SubcontractorRecord[]> {
    const { data, error } = await supabase
      .from('subcontractors')
      .select('*')
      .eq('site_id', siteId)
      .order('business_name');
    
    if (error) {
      console.error(`Error fetching subcontractors for site ${siteId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Get a single subcontractor by ID
  async getSubcontractorById(id: string): Promise<SubcontractorRecord | null> {
    const { data, error } = await supabase
      .from('subcontractors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching subcontractor with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Create a new subcontractor
  async createSubcontractor(subData: Omit<SubcontractorRecord, 'id' | 'created_at' | 'updated_at'>): Promise<SubcontractorRecord> {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const subcontractorRecord = {
      ...subData,
      user_id: user?.id,
    };
    
    const { data, error } = await supabase
      .from('subcontractors')
      .insert(subcontractorRecord)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating subcontractor:', error);
      throw error;
    }
    
    return data;
  },
  
  // Update an existing subcontractor
  async updateSubcontractor(id: string, subData: Partial<SubcontractorRecord>): Promise<SubcontractorRecord> {
    const { data, error } = await supabase
      .from('subcontractors')
      .update(subData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating subcontractor with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Delete a subcontractor
  async deleteSubcontractor(id: string): Promise<void> {
    const { error } = await supabase
      .from('subcontractors')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting subcontractor with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete all subcontractors for a site
  async deleteSubcontractorsForSite(siteId: string): Promise<void> {
    const { error } = await supabase
      .from('subcontractors')
      .delete()
      .eq('site_id', siteId);
    
    if (error) {
      console.error(`Error deleting subcontractors for site ${siteId}:`, error);
      throw error;
    }
  }
};
