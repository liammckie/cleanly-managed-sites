
import { supabase } from '@/lib/supabase';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

// Define ContractHistoryEntry here to avoid dependency on external file
interface ContractHistoryEntry {
  id?: string;
  site_id: string;
  contract_details: ContractDetails;
  notes?: string;
  created_at?: string;
  created_by?: string;
  version_number?: number;
}

export const contractHistoryApi = {
  /**
   * Save a version of contract details to history
   */
  async saveContractVersion(
    siteId: string,
    contractDetails: any,
    notes: string = 'Contract updated'
  ): Promise<boolean> {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      const { error } = await supabase
        .from('site_contract_history')
        .insert({
          site_id: siteId,
          contract_details: contractDetails,
          notes,
          created_by: userId
        });

      if (error) {
        console.error('Error saving contract version:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveContractVersion:', error);
      return false;
    }
  },

  /**
   * Get contract history for a site
   */
  async getContractHistory(siteId: string): Promise<ContractHistoryEntry[]> {
    try {
      const { data, error } = await supabase
        .from('site_contract_history')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contract history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getContractHistory:', error);
      return [];
    }
  }
};
