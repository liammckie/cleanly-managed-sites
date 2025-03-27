
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
