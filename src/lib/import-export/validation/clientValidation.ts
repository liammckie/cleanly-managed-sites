
import { ClientRecord } from '../../types';
import { ValidationMessage, ValidationResult } from '../types';

// Validate client data
export const validateClientData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: Partial<ClientRecord>[] = [];
  
  data.forEach((row, index) => {
    if (!row.name) {
      errors.push({
        row: index + 1,
        field: 'name',
        message: 'Client name is required',
        value: row.name
      });
    }
    
    if (!row.contact_name) {
      errors.push({
        row: index + 1,
        field: 'contact_name',
        message: 'Contact name is required',
        value: row.contact_name
      });
    }
    
    if (row.email && !/\S+@\S+\.\S+/.test(row.email)) {
      warnings.push({
        row: index + 1,
        field: 'email',
        message: 'Email format appears to be invalid',
        value: row.email
      });
    }
    
    // Add the row to validData if it has all required fields
    if (row.name && row.contact_name) {
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
