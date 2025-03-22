
import { ValidationMessage, ValidationResult } from '../types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

// Validate contract data
export const validateContractData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<ContractHistoryEntry>[] = [];
  
  data.forEach((row, index) => {
    if (!row.site_id) {
      errors.push({
        row: index + 1,
        field: 'site_id',
        message: 'Site ID is required',
        value: row.site_id
      });
    }
    
    // Add the row to validData if it has all required fields
    if (row.site_id) {
      // Add to valid data even with warnings
      validData.push(row);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: validData
  };
};
