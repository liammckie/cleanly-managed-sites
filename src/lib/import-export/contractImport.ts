
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/utils/auth';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { toast } from 'sonner';
import { contractDetailsToDb } from '@/lib/adapters/contractAdapter';

export const importContracts = async (contractsData: any[]) => {
  try {
    // Get user ID for proper ownership of records
    const user = await getCurrentUser();
    const userId = user?.id;
    
    if (!userId) {
      return {
        success: false,
        message: 'User not authenticated',
        count: 0
      };
    }
    
    // For simplicity, we'll assume contractsData is already formatted correctly
    // In a real scenario, you'd need to validate/transform the data
    
    // Insert contract history entries
    const contractHistoryEntries = contractsData.map(contract => ({
      site_id: contract.site_id,
      contract_details: contractDetailsToDb(contract.contract_details),
      notes: contract.notes || 'Imported contract',
      created_by: userId
    }));

    // Insert into site_contract_history table individually
    const results = [];
    for (const entry of contractHistoryEntries) {
      const { data, error } = await supabase
        .from('site_contract_history')
        .insert(entry)
        .select();
      
      if (error) {
        console.error('Error inserting contract history:', error);
        return {
          success: false,
          message: `Error importing contracts: ${error.message}`,
          count: 0
        };
      }
      
      results.push(data);
    }
    
    // Return success result
    return {
      success: true,
      message: `Successfully imported ${contractHistoryEntries.length} contracts`,
      count: contractHistoryEntries.length,
      data: results
    };
  } catch (error) {
    console.error('Error in importContracts:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      count: 0
    };
  }
};
