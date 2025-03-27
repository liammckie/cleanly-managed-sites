
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { ValidationResult } from './types';
import { validateContractData } from './validation/contractValidation';
import { supabase } from '@/lib/supabase';

export async function importContracts(
  contracts: Partial<ContractHistoryEntry>[]
): Promise<{ success: boolean; count: number; errors?: any[] }> {
  try {
    // Validate the contracts
    const validation = validateContractData(contracts);
    
    if (!validation.valid) {
      return {
        success: false,
        count: 0,
        errors: validation.errors,
      };
    }
    
    const validContracts = validation.data || [];
    
    // Insert valid contracts
    const { data, error } = await supabase
      .from('site_contract_history')
      .insert(validContracts)
      .select();
    
    if (error) {
      console.error('Error importing contracts:', error);
      return {
        success: false,
        count: 0,
        errors: [{ message: error.message }]
      };
    }
    
    return {
      success: true,
      count: data?.length || validContracts.length,
    };
  } catch (error) {
    console.error('Error importing contracts:', error);
    return {
      success: false,
      count: 0,
      errors: [{ message: (error as Error).message }],
    };
  }
}

export function convertCSVToContractFormat(csvData: any[]): Partial<ContractHistoryEntry>[] {
  return csvData.map(row => {
    // Convert the CSV row to the ContractHistoryEntry format
    const contractDetails = typeof row.contract_details === 'string' 
      ? JSON.parse(row.contract_details) 
      : row.contract_details || {};
      
    return {
      site_id: row.site_id || '',
      contract_details: contractDetails,
      notes: row.notes || '',
      created_by: row.created_by || '',
      version_number: Number(row.version_number) || 0
    };
  });
}
