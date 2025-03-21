
import { supabase } from '@/integrations/supabase/client';

export const contractHistoryApi = {
  async saveContractVersion(
    siteId: string,
    contractDetails: any,
    notes: string = ''
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('site_contract_history')
      .insert({
        site_id: siteId,
        contract_details: contractDetails,
        notes: notes,
        created_by: user?.id
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
  }
};
