
import { supabase } from '@/lib/supabase';
import { ContractHistoryEntry } from '@/types/contracts';
import { Json } from '@/types/common';
import { convertStringToNumeric } from '@/utils/importExportUtils';

export async function importContracts(contracts: Partial<ContractHistoryEntry>[]) {
  try {
    if (!contracts.length) {
      return { success: false, message: 'No contracts to import', count: 0 };
    }

    // Convert contract details to JSON format
    const preparedContracts = contracts.map(contract => {
      // Convert numeric string values to numbers
      const contractDetails = convertStringToNumeric(contract.contract_details || {});
      
      return {
        site_id: contract.site_id,
        contract_details: contractDetails as Json,
        notes: contract.notes || 'Imported contract',
        created_by: contract.created_by,
        // Version number will be automatically set by the trigger
      };
    });

    // Insert each contract individually to handle different validation rules
    for (const contract of preparedContracts) {
      const { error } = await supabase
        .from('site_contract_history')
        .insert(contract);
        
      if (error) {
        console.error('Error importing contract:', error, contract);
        throw error;
      }
    }

    return { 
      success: true, 
      message: `Successfully imported ${contracts.length} contracts`, 
      count: contracts.length 
    };
  } catch (error) {
    console.error('Contract import failed:', error);
    return { 
      success: false, 
      message: `Contract import failed: ${error instanceof Error ? error.message : String(error)}`, 
      count: 0 
    };
  }
}
