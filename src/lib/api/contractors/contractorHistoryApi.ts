
import { supabase } from '@/lib/supabase';
import { ContractorVersionHistoryEntry } from '@/lib/types';

export const contractorHistoryApi = {
  // Get history entries for a contractor
  async getContractorHistory(contractorId: string): Promise<ContractorVersionHistoryEntry[]> {
    // First check if the table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('contractor_history')
      .select('id')
      .limit(1);
    
    if (tableCheckError) {
      console.error('Error checking contractor_history table:', tableCheckError);
      // If the table doesn't exist, return empty array instead of throwing
      if (tableCheckError.code === '42P01') { // PostgreSQL code for undefined_table
        console.log('Contractor history table does not exist yet');
        return [];
      }
      throw tableCheckError;
    }
    
    // If we get here, the table exists, so we can query it
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
