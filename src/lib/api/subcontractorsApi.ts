
import { supabase } from '@/integrations/supabase/client';

export interface SubcontractorRecord {
  id: string;
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  created_at: string;
  updated_at: string;
  services?: string[];
  notes?: string;
  site_id?: string;
}

export const subcontractorsApi = {
  // Get all subcontractors
  getAllSubcontractors: async (): Promise<SubcontractorRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('subcontractors')
        .select('*')
        .order('business_name', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all subcontractors:', error);
      throw error;
    }
  },

  // Get subcontractors for a specific site
  getSubcontractors: async (siteId: string): Promise<SubcontractorRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('subcontractors')
        .select('*')
        .eq('site_id', siteId)
        .order('business_name', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error(`Error fetching subcontractors for site ${siteId}:`, error);
      throw error;
    }
  },

  // Create a new subcontractor
  createSubcontractor: async (subcontractor: Omit<SubcontractorRecord, 'id' | 'created_at' | 'updated_at'>): Promise<SubcontractorRecord> => {
    try {
      const { data, error } = await supabase
        .from('subcontractors')
        .insert(subcontractor)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating subcontractor:', error);
      throw error;
    }
  },

  // Update a subcontractor
  updateSubcontractor: async (id: string, updates: Partial<SubcontractorRecord>): Promise<SubcontractorRecord> => {
    try {
      const { data, error } = await supabase
        .from('subcontractors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error updating subcontractor ${id}:`, error);
      throw error;
    }
  },

  // Delete a subcontractor
  deleteSubcontractor: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('subcontractors')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting subcontractor ${id}:`, error);
      throw error;
    }
  }
};
