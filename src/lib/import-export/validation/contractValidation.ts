
import { ValidationResult, ValidationMessage, ValidationError } from '../types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

/**
 * Validates contract data for importing
 * @param contractsData The contract data to validate
 * @returns Validation result with success flag and error messages
 */
export function validateContractData(contractsData: any[]): ValidationResult<Partial<ContractHistoryEntry>[]> {
  const messages: ValidationMessage[] = [];
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  let valid = true;
  
  if (!Array.isArray(contractsData)) {
    const error = {
      path: 'data',
      message: 'Contract data must be an array'
    };
    errors.push(error);
    messages.push({
      type: 'error',
      field: 'data',
      message: 'Contract data must be an array'
    });
    return { valid: false, errors, warnings, messages };
  }
  
  const validData: Partial<ContractHistoryEntry>[] = [];
  
  contractsData.forEach((contract, index) => {
    const validContract: Partial<ContractHistoryEntry> = {};
    
    // Required fields
    if (!contract.site_id) {
      valid = false;
      const error = {
        path: `[${index}].site_id`,
        message: `Row ${index + 1}: Site ID is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'site_id',
        message: `Row ${index + 1}: Site ID is required`
      });
    } else {
      validContract.site_id = contract.site_id;
    }
    
    // Contract details validation
    if (typeof contract.contract_details === 'string') {
      try {
        validContract.contract_details = JSON.parse(contract.contract_details);
      } catch (e) {
        valid = false;
        const error = {
          path: `[${index}].contract_details`,
          message: `Row ${index + 1}: Invalid contract details JSON format`
        };
        errors.push(error);
        messages.push({
          type: 'error',
          field: 'contract_details',
          message: `Row ${index + 1}: Invalid contract details JSON format`
        });
      }
    } else if (typeof contract.contract_details === 'object') {
      validContract.contract_details = contract.contract_details;
    } else {
      valid = false;
      const error = {
        path: `[${index}].contract_details`,
        message: `Row ${index + 1}: Contract details are required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'contract_details',
        message: `Row ${index + 1}: Contract details are required`
      });
    }
    
    // Copy other fields
    validContract.notes = contract.notes;
    validContract.created_by = contract.created_by;
    validContract.version_number = contract.version_number ? Number(contract.version_number) : undefined;
    
    // Add to valid data if all required fields are present
    if (validContract.site_id && validContract.contract_details) {
      validData.push(validContract);
    }
  });
  
  return { valid, data: validData, errors, warnings, messages };
}
