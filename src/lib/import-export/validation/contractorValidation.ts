
import { ValidationMessage, ValidationResult } from '@/types/common';

// Validate contractor data
export const validateContractorData = (data: any[]): ValidationResult => {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const validData: any[] = [];
  
  data.forEach((row, index) => {
    // Required fields
    if (!row.business_name) {
      errors.push({
        field: 'business_name',
        message: 'Business name is required'
      });
    }
    
    if (!row.contact_name) {
      errors.push({
        field: 'contact_name',
        message: 'Contact name is required'
      });
    }
    
    // Optional fields with format validation
    if (row.email && !isValidEmail(row.email)) {
      warnings.push({
        field: 'email',
        message: 'Invalid email format'
      });
    }
    
    if (row.phone && !isValidPhone(row.phone)) {
      warnings.push({
        field: 'phone',
        message: 'Invalid phone format'
      });
    }
    
    // Services format check if present
    if (row.services) {
      if (typeof row.services === 'string') {
        try {
          JSON.parse(row.services);
        } catch (e) {
          warnings.push({
            field: 'services',
            message: 'Services should be a valid JSON array'
          });
        }
      } else if (!Array.isArray(row.services)) {
        warnings.push({
          field: 'services',
          message: 'Services should be an array'
        });
      }
    }
    
    // Add to valid data if has required fields
    if (row.business_name && row.contact_name) {
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

// Helper functions
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidPhone(phone: string): boolean {
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
  return re.test(phone);
}
