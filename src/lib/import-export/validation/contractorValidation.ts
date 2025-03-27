
import { validateGenericData, validateEmail } from './commonValidation';
import { ValidationError, ValidationResult } from './types';
import { ContractorRecord } from '../types';

/**
 * Validates contractor data for import
 * @param data The contractor data to validate
 * @returns A validation result
 */
export function validateContractorData(data: any[]): ValidationResult<ContractorRecord[]> {
  const requiredFields = ['business_name', 'contact_name', 'contractor_type'];
  
  return validateGenericData<ContractorRecord>(
    data,
    requiredFields,
    (item, index) => {
      const errors: ValidationError[] = [];
      
      // Validate email if present
      const emailError = validateEmail(item.email, 'email', index);
      if (emailError) errors.push(emailError);
      
      // Status validation
      if (item.status && !['active', 'inactive', 'pending'].includes(item.status)) {
        errors.push({
          path: 'status',
          message: 'Status must be one of: active, inactive, pending',
          row: index,
          value: item.status
        });
      }
      
      // Validate specialty is an array if present
      if (item.specialty && !Array.isArray(item.specialty)) {
        // Try to convert from string
        try {
          if (typeof item.specialty === 'string') {
            item.specialty = JSON.parse(item.specialty);
          }
        } catch (e) {
          errors.push({
            path: 'specialty',
            message: 'Specialty must be an array',
            row: index,
            value: item.specialty
          });
        }
      }
      
      return errors;
    }
  );
}
