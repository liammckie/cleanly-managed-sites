
import { supabase } from '@/lib/supabase';
import { ValidationResult, ImportOptions, ImportResult } from '@/lib/types/validationTypes';
import { adaptContractDetailsToDb } from '@/lib/adapters/contractAdapter';
import { validateContractData } from './validation/contractValidation';

export async function importContracts(contracts: any[], options: ImportOptions = { mode: 'incremental' }): Promise<ImportResult> {
  // Check if any contracts were provided
  if (!contracts || contracts.length === 0) {
    return {
      success: false,
      errors: ['No contracts provided'],
      message: 'Import failed: No contracts provided'
    };
  }

  // Validate all contracts
  const validationResult = validateContractData(contracts);
  
  if (!validationResult.valid && !options.skipValidation) {
    return {
      success: false,
      errors: validationResult.errors.map(e => e.message),
      message: 'Validation failed'
    };
  }

  try {
    let imported = 0;
    const validData = validationResult.validContracts || contracts;
    
    // Process each contract
    for (const contract of validData) {
      const userId = 'system'; // Default user ID for imports
      const contractDetails = adaptContractDetailsToDb(contract.details || contract);
      
      // Insert into contract history
      const { error } = await supabase
        .from('site_contract_history')
        .insert({
          site_id: contract.site_id,
          contract_details: contractDetails,
          notes: contract.notes,
          created_by: userId,
          version_number: 1 // Add the missing field
        });
      
      if (error) {
        console.error('Error inserting contract:', error);
        return {
          success: false,
          errors: [error.message],
          message: `Error importing contracts: ${error.message}`
        };
      }
      
      imported++;
    }
    
    return {
      success: true,
      errors: [],
      imported,
      message: `Successfully imported ${imported} contracts`
    };
    
  } catch (error: any) {
    console.error('Error importing contracts:', error);
    return {
      success: false,
      errors: [error.message],
      message: `Error importing contracts: ${error.message}`
    };
  }
}
