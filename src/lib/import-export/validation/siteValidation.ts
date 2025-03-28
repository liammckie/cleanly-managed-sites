
import { validateGenericData, validateEmail } from './commonValidation';
import { ValidationError, ValidationResult } from './types';

export interface SiteImportItem {
  name: string;
  client_id: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  status?: string;
  email?: string;
  phone?: string;
  representative?: string;
  monthly_revenue?: number;
  custom_id?: string;
  notes?: string;
}

/**
 * Validates site data for import
 * @param data The site data to validate
 * @returns A validation result
 */
export function validateSiteData(data: any[]): ValidationResult<SiteImportItem[]> {
  const requiredFields = ['name', 'client_id', 'address', 'city', 'state', 'postcode'];
  
  return validateGenericData<SiteImportItem>(
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
      if (item.status && !['active', 'inactive', 'pending', 'on-hold', 'lost'].includes(item.status)) {
        errors.push({
          path: 'status',
          message: 'Status must be one of: active, inactive, pending, on-hold, lost',
          row: index,
          value: item.status
        });
      }
      
      // Validate monthly_revenue if provided
      if (item.monthly_revenue !== undefined && isNaN(Number(item.monthly_revenue))) {
        errors.push({
          path: 'monthly_revenue',
          message: 'Monthly revenue must be a number',
          row: index,
          value: item.monthly_revenue
        });
      }
      
      return errors;
    }
  );
}
