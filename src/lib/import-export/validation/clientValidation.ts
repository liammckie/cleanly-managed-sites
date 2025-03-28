
import { validateGenericData, validateEmail } from './commonValidation';
import { ValidationError, ValidationResult } from './types';

export interface ClientImportItem {
  name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status?: string;
  notes?: string;
}

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
      
      // Validate email if provided
      if (item.email) {
        const emailError = validateEmail(item.email, 'email', index);
        if (emailError) errors.push(emailError);
      }
      
      // Validate status if provided
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
