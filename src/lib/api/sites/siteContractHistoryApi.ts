
import { supabase } from '@/lib/supabase';
import { Json } from '@/lib/types';

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: Json;
  created_at: string;
  created_by?: string;
  notes?: string;
  version_number: number;
}

export const contractHistoryApi = {
  async fetchContractHistory(siteId: string): Promise<ContractHistoryEntry[]> {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contract history:', error);
      throw new Error(`Failed to fetch contract history: ${error.message}`);
    }

    return data || [];
  },

  async saveContractVersion(
    siteId: string,
    contractDetails: Json,
    notes: string = ''
  ): Promise<ContractHistoryEntry> {
    // Create a new entry without version_number as it's handled by DB trigger
    const { data, error } = await supabase
      .from('site_contract_history')
      .insert({
        site_id: siteId,
        contract_details: contractDetails,
        notes,
        created_by: (await supabase.auth.getUser()).data?.user?.id || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving contract version:', error);
      throw new Error(`Failed to save contract version: ${error.message}`);
    }

    return data;
  }
};
