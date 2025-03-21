
import { supabase } from '@/integrations/supabase/client';

export const contractHistoryApi = {
  async saveContractVersion(
    siteId: string,
    contractDetails: any,
    notes: string = ''
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    // We don't need to set version_number manually as the database trigger will handle this
    const { error } = await supabase
      .from('site_contract_history')
      .insert({
        site_id: siteId,
        contract_details: contractDetails,
        notes: notes,
        created_by: user?.id,
        // Removed version_number as it's set by a database trigger
      });

    if (error) {
      console.error('Error saving contract history:', error);
      throw error;
    }
  },

  async getContractHistory(siteId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('site_id', siteId)
      .order('version_number', { ascending: false });

    if (error) {
      console.error(`Error fetching contract history for site ${siteId}:`, error);
      throw error;
    }

    return data || [];
  },

  // Implement the missing getContractVersion function
  async getContractVersion(versionId: string): Promise<any> {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('id', versionId)
      .single();

    if (error) {
      console.error(`Error fetching contract version ${versionId}:`, error);
      throw error;
    }

    return data;
  }
};
