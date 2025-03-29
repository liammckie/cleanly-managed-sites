
import { supabase } from '@/lib/supabase';
import { ContractHistoryEntry } from '@/types/contracts';
import { Json } from '@/types/common';

export const contractHistoryApi = {
  async fetchContractHistory(siteId: string): Promise<ContractHistoryEntry[]> {
    try {
      const { data, error } = await supabase
        .from('site_contract_history')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contract history:', error);
        throw new Error(error.message);
      }

      return data as ContractHistoryEntry[];
    } catch (error) {
      console.error('Failed to fetch contract history:', error);
      throw error;
    }
  },

  async getContractVersion(versionId: string): Promise<ContractHistoryEntry | null> {
    try {
      const { data, error } = await supabase
        .from('site_contract_history')
        .select('*')
        .eq('id', versionId)
        .single();

      if (error) {
        console.error('Error fetching contract version:', error);
        throw new Error(error.message);
      }

      return data as ContractHistoryEntry;
    } catch (error) {
      console.error('Failed to fetch contract version:', error);
      throw error;
    }
  },

  async saveContractVersion(
    siteId: string,
    contractDetails: Json,
    notes?: string
  ): Promise<ContractHistoryEntry> {
    try {
      // Since version_number is managed by a database trigger, we don't need to provide it here
      const entry = {
        site_id: siteId,
        contract_details: contractDetails,
        notes,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      };

      const { data, error } = await supabase
        .from('site_contract_history')
        .insert(entry)
        .select()
        .single();

      if (error) {
        console.error('Error saving contract version:', error);
        throw new Error(error.message);
      }

      return data as ContractHistoryEntry;
    } catch (error) {
      console.error('Failed to save contract version:', error);
      throw error;
    }
  }
};

// Export the type for use in other files
export type { ContractHistoryEntry };
