
import { validateGenericData, validateEmail } from './commonValidation';
import { ValidationError, ValidationResult } from './types';
import { ContractorRecord } from '@/lib/import-export/types';

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
      
      // Validate email if provided
      if (item.email) {
        const emailError = validateEmail(item.email, 'email', index);
        if (emailError) errors.push(emailError);
      }
      
      // Validate status if provided
      if (item.status && !['active', 'inactive', 'pending'].includes(item.status)) {
        errors.push({
          path: 'status',
          message: 'Status must be one of: active, inactive, pending',
          row: index,
          value: item.status
        });
      }
      
      // Validate contractor_type
      if (!item.contractor_type) {
        errors.push({
          path: 'contractor_type',
          message: 'Contractor type is required',
          row: index
        });
      }
      
      // Validate hourly_rate and day_rate if provided
      if (item.hourly_rate !== undefined && isNaN(Number(item.hourly_rate))) {
        errors.push({
          path: 'hourly_rate',
          message: 'Hourly rate must be a number',
          row: index,
          value: item.hourly_rate
        });
      }
      
      if (item.day_rate !== undefined && isNaN(Number(item.day_rate))) {
        errors.push({
          path: 'day_rate',
          message: 'Day rate must be a number',
          row: index,
          value: item.day_rate
        });
      }
      
      return errors;
    }
  );
}
