
import { ValidationError, ValidationResult } from '@/lib/types';

export const simplifyValidationErrors = (errors: ValidationError[]): string[] => {
  return errors.map(error => `${error.field}: ${error.message}`);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidDateFormat = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

export const validateRequiredFields = (
  data: any,
  requiredFields: string[]
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push({
        field,
        message: `${field} is required`
      });
    }
  });
  
  return errors;
};

export const mergeValidationResults = (
  results: ValidationResult[]
): ValidationResult => {
  return {
    valid: results.every(r => r.valid),
    errors: results.flatMap(r => r.errors),
    warnings: results.flatMap(r => r.warnings || []),
    validData: results.flatMap(r => r.validData || [])
  };
};
