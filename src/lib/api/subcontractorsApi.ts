
import { supabase } from '@/integrations/supabase/client';

export interface SubcontractorRecord {
  id: string;
  business_name: string;
  contact_name?: string; // Make this optional to match Supabase schema
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  created_at: string;
  updated_at: string;
  services?: string[] | any; // Allow both string[] and Json types 
  notes?: string;
  site_id: string; // Required for database operations
  custom_services?: string;
  monthly_cost?: number;
  is_flat_rate?: boolean;
  contractor_id?: string;
  user_id?: string;
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

      // Process the data to ensure services is an array
      const processedData = data?.map(sub => ({
        ...sub,
        services: Array.isArray(sub.services) ? sub.services : (sub.services ? [sub.services] : [])
      }));

      return processedData || [];
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

      // Process the data to ensure services is an array
      const processedData = data?.map(sub => ({
        ...sub,
        services: Array.isArray(sub.services) ? sub.services : (sub.services ? [sub.services] : [])
      }));

      return processedData || [];
    } catch (error) {
      console.error(`Error fetching subcontractors for site ${siteId}:`, error);
      throw error;
    }
  },

  // Create a new subcontractor
  createSubcontractor: async (subcontractor: Omit<SubcontractorRecord, 'id' | 'created_at' | 'updated_at'>): Promise<SubcontractorRecord> => {
    try {
      // Ensure we're sending a properly formatted subcontractor object
      const formattedSubcontractor = {
        business_name: subcontractor.business_name,
        site_id: subcontractor.site_id,
        contact_name: subcontractor.contact_name || '', // Provide default value for required field
        email: subcontractor.email,
        phone: subcontractor.phone,
        services: subcontractor.services || [],
        custom_services: subcontractor.custom_services,
        monthly_cost: subcontractor.monthly_cost,
        is_flat_rate: subcontractor.is_flat_rate,
        contractor_id: subcontractor.contractor_id,
        user_id: subcontractor.user_id
      };

      const { data, error } = await supabase
        .from('subcontractors')
        .insert(formattedSubcontractor)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Ensure services is properly formatted as an array in the response
      const processedData = {
        ...data,
        services: Array.isArray(data.services) ? data.services : (data.services ? [data.services] : [])
      };

      return processedData;
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

      // Ensure services is properly formatted as an array in the response
      const processedData = {
        ...data,
        services: Array.isArray(data.services) ? data.services : (data.services ? [data.services] : [])
      };

      return processedData;
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
