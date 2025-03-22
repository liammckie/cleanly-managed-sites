
import { supabase } from '../supabase';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { validateContractData } from './validation/contractValidation';
import { checkExistingItems } from './validation/commonValidation';

// Import contracts
export const importContracts = async (contracts: Partial<ContractHistoryEntry>[]): Promise<void> => {
  // Validate contract data
  const { isValid, errors, data: validData } = validateContractData(contracts);
  
  if (!isValid) {
    console.error('Invalid contract data:', errors);
    throw new Error(`Invalid contract data. Please check your import file. ${errors.map(e => e.message).join(', ')}`);
  }
  
  // Check for existing contracts by ID to avoid duplicates
  const contractsWithIds = validData.filter(contract => contract.id);
  const existingIds = await checkExistingItems('site_contract_history', contractsWithIds.map(contract => contract.id as string));
  
  const contractsToInsert = validData.filter(contract => !contract.id || !existingIds.includes(contract.id));
  const contractsToUpdate = validData.filter(contract => contract.id && existingIds.includes(contract.id));
  
  // Insert new contracts
  if (contractsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('site_contract_history')
      .insert(contractsToInsert.map(contract => ({
        site_id: contract.site_id,
        contract_details: contract.contract_details,
        notes: contract.notes || '',
        version_number: 0 // This will be set by the database trigger
      })));
    
    if (insertError) {
      console.error('Error inserting contracts:', insertError);
      throw new Error(`Failed to import contracts: ${insertError.message}`);
    }
  }
  
  // Update existing contracts
  for (const contract of contractsToUpdate) {
    // For site_contract_history, updates might not be appropriate since they're versioned
    // You might want to insert a new version instead of updating
    console.warn('Updating existing contract histories is not recommended. Consider inserting a new version instead.');
    
    const { error: updateError } = await supabase
      .from('site_contract_history')
      .update({
        contract_details: contract.contract_details,
        notes: contract.notes || ''
      })
      .eq('id', contract.id);
    
    if (updateError) {
      console.error(`Error updating contract ${contract.id}:`, updateError);
    }
  }
};
