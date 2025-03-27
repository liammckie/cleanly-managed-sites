
import { SiteRecord } from '../../types';
import { ValidationMessage, ValidationResult } from '@/types/common';

// Validate site data
export const validateSiteData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<SiteRecord>[] = [];
  
  data.forEach((row, index) => {
    if (!row.name) {
      errors.push({
        field: 'name',
        message: 'Site name is required'
      });
    }
    
    if (!row.address) {
      errors.push({
        field: 'address',
        message: 'Site address is required'
      });
    }
    
    if (!row.client_id) {
      errors.push({
        field: 'client_id',
        message: 'Client ID is required'
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
