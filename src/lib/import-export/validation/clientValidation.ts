
import { validateGenericData, validateEmail } from './commonValidation';
import { ValidationError, ValidationResult } from './types';
import { ClientImportItem } from '../types';

/**
 * Validates client data for import
 * @param data The client data to validate
 * @returns A validation result
 */
export function validateClientData(data: any[]): ValidationResult<ClientImportItem[]> {
  const requiredFields = ['name', 'contact_name'];
  
  return validateGenericData<ClientImportItem>(
    data,
    requiredFields,
    (item, index) => {
      const errors: ValidationError[] = [];
      
      // Validate email if present
      const emailError = validateEmail(item.email, 'email', index);
      if (emailError) errors.push(emailError);
      
      // Status validation
      if (item.status && !['active', 'inactive', 'prospect', 'pending'].includes(item.status)) {
        errors.push({
          path: 'status',
          message: 'Status must be one of: active, inactive, prospect, pending',
          row: index,
          value: item.status
        });
      }
      
      return errors;
    }
  );
}
