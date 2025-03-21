
import { supabase } from '@/integrations/supabase/client';

export const contractHistoryApi = {
  async saveContractVersion(
    siteId: string,
    contractDetails: any,
    notes: string = ''
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    // Note: The version_number is automatically set via a database trigger
    // This was previously causing an error because our code was trying to set a field
    // that's automatically set by the database
    const { error } = await supabase
      .from('site_contract_history')
      .insert({
        site_id: siteId,
        contract_details: contractDetails,
        notes: notes,
        created_by: user?.id,
        // The version_number is omitted as it's auto-set by a database trigger
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
