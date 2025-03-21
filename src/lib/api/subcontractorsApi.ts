
import { supabase } from '@/integrations/supabase/client';

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
