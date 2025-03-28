
import { validateGenericData, validateDateFormat } from './commonValidation';
import { ValidationError, ValidationResult } from './types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

/**
 * Validates contract data for import
 * @param data The contract data to validate
 * @returns A validation result
 */
export function validateContractData(data: any[]): ValidationResult<Partial<ContractHistoryEntry>[]> {
  const requiredFields = ['site_id'];
  
  return validateGenericData<Partial<ContractHistoryEntry>>(
    data,
    requiredFields,
    (item, index) => {
      const errors: ValidationError[] = [];
      
      // Ensure contract_details exists and is an object
      if (!item.contract_details) {
        errors.push({
          path: 'contract_details',
          message: 'Contract details are required',
          row: index
        });
      } else if (typeof item.contract_details === 'string') {
        // Try to parse if it's a string
        try {
          item.contract_details = JSON.parse(item.contract_details);
        } catch (e) {
          errors.push({
            path: 'contract_details',
            message: 'Contract details must be valid JSON',
            row: index,
            value: item.contract_details
          });
        }
      }
      
      // Validate contract dates if they exist
      if (item.contract_details && typeof item.contract_details === 'object') {
        const contract = item.contract_details;
        
        if (contract.startDate) {
          const startDateError = validateDateFormat(contract.startDate, 'startDate', index);
          if (startDateError) errors.push(startDateError);
        }
        
        if (contract.endDate) {
          const endDateError = validateDateFormat(contract.endDate, 'endDate', index);
          if (endDateError) errors.push(endDateError);
          
          // Check that end date is after start date
          if (contract.startDate && contract.endDate && new Date(contract.endDate) <= new Date(contract.startDate)) {
            errors.push({
              path: 'endDate',
              message: 'End date must be after start date',
              row: index,
              value: contract.endDate
            });
          }
        }
      }
      
      return errors;
    }
  );
}

/**
 * Validates contract terms within a contract
 * @param contractTerms The contract terms to validate
 * @param rowIndex Optional row index for error context
 * @returns Array of validation errors
 */
export function validateContractTerms(contractTerms: any[], rowIndex?: number): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!Array.isArray(contractTerms)) {
    return [{
      path: 'terms',
      message: 'Contract terms must be an array',
      row: rowIndex,
      value: contractTerms
    }];
  }
  
  contractTerms.forEach((term, index) => {
    if (!term.name) {
      errors.push({
        path: `terms[${index}].name`,
        message: 'Term name is required',
        row: rowIndex,
        value: term
      });
    }
    
    // Validate term dates
    if (term.startDate && term.endDate) {
      const startDateError = validateDateFormat(term.startDate, `terms[${index}].startDate`, rowIndex);
      if (startDateError) errors.push(startDateError);
      
      const endDateError = validateDateFormat(term.endDate, `terms[${index}].endDate`, rowIndex);
      if (endDateError) errors.push(endDateError);
      
      // Check that end date is after start date
      if (new Date(term.endDate) <= new Date(term.startDate)) {
        errors.push({
          path: `terms[${index}].endDate`,
          message: 'End date must be after start date',
          row: rowIndex,
          value: term.endDate
        });
      }
    }
  });
  
  return errors;
}

/**
 * Exports validation functions for explicit imports
 */
export const contractValidation = {
  validateContractData,
  validateContractTerms
};
