
import { SiteRecord } from '../../types';
import { ValidationMessage, ValidationResult } from '../types';

// Validate site data
export const validateSiteData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<SiteRecord>[] = [];
  
  data.forEach((row, index) => {
    if (!row.name) {
      errors.push({
        row: index + 1,
        field: 'name',
        message: 'Site name is required',
        value: row.name
      });
    }
    
    if (!row.address) {
      errors.push({
        row: index + 1,
        field: 'address',
        message: 'Site address is required',
        value: row.address
      });
    }
    
    if (!row.client_id) {
      errors.push({
        row: index + 1,
        field: 'client_id',
        message: 'Client ID is required',
        value: row.client_id
      });
    }
    
    // Add the row to validData if it has all required fields
    if (row.name && row.address && row.client_id) {
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
