
import { validateGenericData, validateEmail } from './commonValidation';
import { ValidationError, ValidationResult } from './types';
import { SiteRecord } from '@/lib/types';

/**
 * Validates site data for import
 * @param data The site data to validate
 * @returns A validation result
 */
export function validateSiteData(data: any[]): ValidationResult<Partial<SiteRecord>[]> {
  const requiredFields = ['name', 'address', 'city', 'state', 'client_id'];
  
  return validateGenericData<Partial<SiteRecord>>(
    data,
    requiredFields,
    (item, index) => {
      const errors: ValidationError[] = [];
      
      // Validate email if present
      const emailError = validateEmail(item.email, 'email', index);
      if (emailError) errors.push(emailError);
      
      // Status validation
      if (item.status && !['active', 'inactive', 'pending', 'on-hold'].includes(item.status)) {
        errors.push({
          path: 'status',
          message: 'Status must be one of: active, inactive, pending, on-hold',
          row: index,
          value: item.status
        });
      }
      
      // Ensure postcode is set if postal_code is provided and vice versa
      if (item.postal_code && !item.postcode) {
        item.postcode = item.postal_code;
      } else if (item.postcode && !item.postal_code) {
        item.postal_code = item.postcode;
      }
      
      // Validate any JSON fields
      const jsonFields = ['contract_details', 'job_specifications', 'security_details', 'billing_details', 'replenishables'];
      
      jsonFields.forEach(field => {
        if (item[field] && typeof item[field] === 'string') {
          try {
            item[field] = JSON.parse(item[field]);
          } catch (e) {
            errors.push({
              path: field,
              message: `${field} must be valid JSON`,
              row: index,
              value: item[field]
            });
          }
        }
      });
      
      return errors;
    }
  );
}
