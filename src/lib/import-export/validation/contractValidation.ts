
import { ValidationResult, ValidationMessage } from './types';

/**
 * Validates contract data for importing
 * @param contractsData The contract data to validate
 * @returns Validation result with success flag and error messages
 */
export function validateContractData(contractsData: any[]): ValidationResult {
  const messages: ValidationMessage[] = [];
  let isValid = true;
  
  if (!Array.isArray(contractsData)) {
    messages.push({
      type: 'error',
      field: 'data',
      message: 'Contract data must be an array'
    });
    return { valid: false, messages };
  }
  
  contractsData.forEach((contract, index) => {
    // Required fields
    if (!contract.site_id) {
      messages.push({
        type: 'error',
        field: 'site_id',
        message: `Row ${index + 1}: Site ID is required`
      });
      isValid = false;
    }
    
    // Date validation
    if (contract.start_date && isNaN(Date.parse(contract.start_date))) {
      messages.push({
        type: 'error',
        field: 'start_date',
        message: `Row ${index + 1}: Invalid start date format`
      });
      isValid = false;
    }
    
    if (contract.end_date && isNaN(Date.parse(contract.end_date))) {
      messages.push({
        type: 'error',
        field: 'end_date',
        message: `Row ${index + 1}: Invalid end date format`
      });
      isValid = false;
    }
    
    // Logic validation
    if (contract.start_date && contract.end_date) {
      const startDate = new Date(contract.start_date);
      const endDate = new Date(contract.end_date);
      
      if (startDate > endDate) {
        messages.push({
          type: 'error',
          field: 'dates',
          message: `Row ${index + 1}: End date cannot be before start date`
        });
        isValid = false;
      }
    }
    
    // Status validation
    if (contract.status && !['active', 'pending', 'expired', 'terminated', 'renewed'].includes(contract.status)) {
      messages.push({
        type: 'warning',
        field: 'status',
        message: `Row ${index + 1}: Invalid status, will default to 'active'`
      });
    }
    
    // Value validation
    if (contract.value && (isNaN(Number(contract.value)) || Number(contract.value) < 0)) {
      messages.push({
        type: 'error',
        field: 'value',
        message: `Row ${index + 1}: Contract value must be a positive number`
      });
      isValid = false;
    }
  });
  
  return { valid: isValid, messages };
}
