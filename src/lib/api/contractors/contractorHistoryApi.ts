
import { supabase } from '@/lib/supabase';
import { ContractorVersionHistoryEntry } from '@/lib/types';

export const contractorHistoryApi = {
  // Get history entries for a contractor
  async getContractorHistory(contractorId: string): Promise<ContractorVersionHistoryEntry[]> {
    try {
      // First check if the table exists
      const { data: tableInfo } = await supabase
        .rpc('get_table_definition', { table_name: 'contractor_history' });
      
      const tableExists = tableInfo && tableInfo.length > 0;
      
      if (!tableExists) {
        console.log('Contractor history table does not exist yet');
        return [];
      }
      
      // Use a raw query to select from the table, which avoids TypeScript errors
      // since the table might not be in the TypeScript definition
      const { data, error } = await supabase
        .from('contractor_history')
        .select('*')
        .eq('contractor_id', contractorId)
        .order('version_number', { ascending: false });
      
      if (error) {
        console.error(`Error fetching history for contractor with ID ${contractorId}:`, error);
        throw error;
      }
      
      // Explicitly convert to the expected type
      return (data || []) as ContractorVersionHistoryEntry[];
    } catch (error) {
      console.error(`Error in getContractorHistory for ID ${contractorId}:`, error);
      // Return empty array instead of throwing to make the UI more resilient
      return [];
    }
  }
};
