
import { supabase } from '@/lib/supabase';
import { ContractorVersionHistoryEntry } from '@/lib/types';

// Functions to manage contractor history
export const contractorHistoryApi = {
  // Get history entries for a contractor
  async getContractorHistory(contractorId: string): Promise<ContractorVersionHistoryEntry[]> {
    const { data, error } = await supabase
      .from('contractor_history')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('version_number', { ascending: false });
    
    if (error) {
      console.error(`Error fetching history for contractor ${contractorId}:`, error);
      throw error;
    }
    
    return data as ContractorVersionHistoryEntry[];
  },
  
  // Get specific history entry
  async getHistoryEntry(historyId: string): Promise<ContractorVersionHistoryEntry | null> {
    const { data, error } = await supabase
      .from('contractor_history')
      .select('*')
      .eq('id', historyId)
      .single();
    
    if (error) {
      console.error(`Error fetching history entry ${historyId}:`, error);
      throw error;
    }
    
    return data as ContractorVersionHistoryEntry;
  }
};
