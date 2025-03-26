
import { supabase } from '@/lib/supabase';
import { ContractHistoryEntry } from '@/hooks/useSiteContractHistory';
import { Json } from '@/types';

/**
 * API functions for working with site contract history
 */
export const contractHistoryApi = {
  /**
   * Fetch the contract history for a site
   */
  async fetchContractHistory(siteId: string): Promise<ContractHistoryEntry[]> {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('site_id', siteId)
      .order('version_number', { ascending: false });

    if (error) {
      console.error('Error fetching contract history:', error);
      throw new Error('Failed to fetch contract history');
    }

    return data as ContractHistoryEntry[];
  },

  /**
   * Save a new version of a contract to the history
   */
  async saveContractVersion(
    siteId: string,
    contractDetails: Json,
    notes: string = 'Contract updated'
  ): Promise<void> {
    try {
      // First get the highest version number for this site
      const { data: lastVersion, error: versionError } = await supabase
        .from('site_contract_history')
        .select('version_number')
        .eq('site_id', siteId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      if (versionError && versionError.code !== 'PGRST116') {
        console.error('Error fetching last version:', versionError);
      }

      const nextVersionNumber = lastVersion ? lastVersion.version_number + 1 : 1;

      // Insert the new history entry with the calculated version number
      const { error } = await supabase
        .from('site_contract_history')
        .insert({
          site_id: siteId,
          contract_details: contractDetails,
          notes: notes,
          created_by: supabase.auth.getUser()?.data?.user?.id,
          version_number: nextVersionNumber
        });

      if (error) {
        console.error('Error saving contract version:', error);
        throw new Error('Failed to save contract version');
      }
    } catch (error) {
      console.error('Error in saveContractVersion:', error);
      throw error;
    }
  }
};
