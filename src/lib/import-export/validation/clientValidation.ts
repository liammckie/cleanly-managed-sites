
import { ClientRecord } from '@/lib/types';
import { EnhancedValidationResult, ValidationMessage } from '@/types/common';

export function validateClientRecord(record: Partial<ClientRecord>, rowNumber: number): ValidationMessage[] {
  const errors: ValidationMessage[] = [];
  
  if (!record.name || record.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Client name is required',
      row: rowNumber,
      type: 'error'
    });
  }
  
  if (!record.contact_name || record.contact_name.trim() === '') {
    errors.push({
      field: 'contact_name',
      message: 'Contact name is required',
      row: rowNumber,
      type: 'error'
    });
  }
  
  if (record.email && !/^\S+@\S+\.\S+$/.test(record.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email format',
      row: rowNumber,
      type: 'error'
    });
  }
  
  return errors;
}

export function validateClientImport(clients: Partial<ClientRecord>[]): EnhancedValidationResult {
  let isValid = true;
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  
  clients.forEach((client, index) => {
    const recordErrors = validateClientRecord(client, index);
    
    if (recordErrors.length > 0) {
      isValid = false;
      errors.push(...recordErrors);
    }
  });
  
  return {
    isValid,
    errors,
    warnings,
    messages: [...errors, ...warnings],
    data: clients,
    success: isValid
  };
}
