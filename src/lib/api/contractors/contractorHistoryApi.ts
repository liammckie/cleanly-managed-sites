
import { supabase } from '@/lib/supabase';
import { ContractorVersionHistoryEntry } from '@/lib/types';

export const contractorHistoryApi = {
  // Get history entries for a contractor
  async getContractorHistory(contractorId: string): Promise<ContractorVersionHistoryEntry[]> {
    try {
      // Since we've now created the contractor_history table, we can query it directly
      const { data, error } = await supabase
        .from('contractor_history')
        .select('*')
        .eq('contractor_id', contractorId)
        .order('version_number', { ascending: false });
      
      if (error) {
        console.error(`Error fetching history for contractor with ID ${contractorId}:`, error);
        throw error;
      }
      
      // Process the data to match the ContractorVersionHistoryEntry type
      return (data || []).map(entry => ({
        id: entry.id,
        contractor_id: entry.contractor_id,
        contractor_data: entry.contractor_data,
        version_number: entry.version_number,
        notes: entry.notes || '',
        created_at: entry.created_at,
        created_by: entry.created_by
      })) as ContractorVersionHistoryEntry[];
    } catch (error) {
      console.error(`Error in getContractorHistory for ID ${contractorId}:`, error);
      // Return empty array instead of throwing to make the UI more resilient
      return [];
    }
  }
};
