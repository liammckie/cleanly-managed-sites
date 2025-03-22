
import { supabase } from '@/lib/supabase';
import { ContractorVersionHistoryEntry } from '@/lib/types';

export const contractorHistoryApi = {
  // Get history entries for a contractor
  async getContractorHistory(contractorId: string): Promise<ContractorVersionHistoryEntry[]> {
    const { data, error } = await supabase
      .from('contractor_history')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('version_number', { ascending: false });
    
    if (error) {
      console.error(`Error fetching history for contractor with ID ${contractorId}:`, error);
      throw error;
    }
    
    return data as ContractorVersionHistoryEntry[] || [];
  }
};
