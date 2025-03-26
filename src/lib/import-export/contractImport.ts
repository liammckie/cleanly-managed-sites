
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
    
    if (!validation.isValid) {
      return {
        success: false,
        count: 0,
        errors: validation.errors,
      };
    }
    
    // In a real implementation, we would insert the contracts into the database
    // For now, we'll just simulate success
    console.log('Would import contracts:', contracts);
    
    return {
      success: true,
      count: contracts.length,
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
    return {
      site_id: row.site_id || '',
      contract_details: typeof row.contract_details === 'string' 
        ? JSON.parse(row.contract_details) 
        : row.contract_details || {},
      notes: row.notes || '',
      created_by: row.created_by || '',
      version_number: Number(row.version_number) || 0
    };
  });
}
