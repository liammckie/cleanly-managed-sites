
import { supabase } from '@/lib/supabase';
import { ContractHistoryEntry } from '@/lib/types/contracts';
import { Json } from '@/lib/types/common';

/**
 * Contract history API functions
 */
export const contractHistoryApi = {
  /**
   * Save a new version of contract details to history
   */
  async saveContractVersion(
    siteId: string,
    contractDetails: any,
    notes: string = '',
    userId: string = 'system'
  ): Promise<boolean> {
    try {
      // First get the latest version number
      const { data: latestVersions, error: versionError } = await supabase
        .from('site_contract_history')
        .select('version_number')
        .eq('site_id', siteId)
        .order('version_number', { ascending: false })
        .limit(1);

      if (versionError) throw versionError;

      // Calculate the next version number
      const nextVersionNumber = latestVersions && latestVersions.length > 0
        ? (latestVersions[0].version_number || 0) + 1
        : 1;

      // Save the contract version with the calculated version number
      const { data, error } = await supabase
        .from('site_contract_history')
        .insert({
          site_id: siteId,
          contract_details: contractDetails,
          notes: notes,
          created_by: userId,
          version_number: nextVersionNumber
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error saving contract version:', error);
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
        .order('version_number', { ascending: false });

      if (error) throw error;

      return data as ContractHistoryEntry[];
    } catch (error) {
      console.error('Error fetching contract history:', error);
      return [];
    }
  },

  /**
   * Get a specific contract history entry
   */
  async getContractHistoryEntry(entryId: string): Promise<ContractHistoryEntry | null> {
    try {
      const { data, error } = await supabase
        .from('site_contract_history')
        .select('*')
        .eq('id', entryId)
        .single();

      if (error) throw error;

      return data as ContractHistoryEntry;
    } catch (error) {
      console.error('Error fetching contract history entry:', error);
      return null;
    }
  }
};
