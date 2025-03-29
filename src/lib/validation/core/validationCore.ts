
import { ValidationError, ValidationMessage, ValidationResult } from '@/lib/types/validationTypes';

/**
 * Add a warning to a validation result
 */
export const addWarning = (
  result: ValidationResult, 
  field: string, 
  message: string, 
  type: 'error' | 'warning' | 'info' = 'warning'
): ValidationResult => {
  if (!result.warnings) {
    result.warnings = [];
  }
  result.warnings.push({ field, message, type });
  return result;
};

/**
 * Creates a new validation result object
 */
export const createValidationResult = (valid: boolean = true, errors: ValidationError[] = []): ValidationResult => {
  return {
    valid,
    errors
  };
};

/**
 * Adds an error to a validation result
 */
export const addError = (
  result: ValidationResult,
  field: string,
  message: string
): ValidationResult => {
  result.valid = false;
  result.errors.push({ field, message });
  return result;
};

/**
 * Formats Zod errors into a standard format
 */
export const formatZodErrors = (errors: any): ValidationError[] => {
  if (!errors || !errors.errors) return [];
  
  return errors.errors.map((err: any) => ({
    field: err.path.join('.'),
    message: err.message
  }));
};

/**
 * Formats validation errors from object format into array format
 */
export const formatValidationErrors = (errors: Record<string, string>): ValidationError[] => {
  return Object.entries(errors).map(([field, message]) => ({
    field,
    message
  }));
};

/**
 * Validates that required fields are present
 */
export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): ValidationResult => {
  const result = createValidationResult();
  
  for (const field of requiredFields) {
    const value = data[field];
    if (value === undefined || value === null || value === '') {
      addError(result, field, `${field} is required`);
    }
  }
  
  return result;
};

/**
 * Merges multiple validation results
 */
export const mergeValidationResults = (results: ValidationResult[]): ValidationResult => {
  const merged = createValidationResult();
  
  for (const result of results) {
    if (!result.valid) {
      merged.valid = false;
    }
    
    if (result.errors && result.errors.length > 0) {
      merged.errors = [...merged.errors, ...result.errors];
    }
    
    if (result.warnings && result.warnings.length > 0) {
      merged.warnings = merged.warnings || [];
      merged.warnings = [...merged.warnings, ...result.warnings];
    }
  }
  
  return merged;
};

/**
 * Simple utility to check if a string is a valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Simple utility to check if a string is a valid date format (YYYY-MM-DD)
 */
export const isValidDateFormat = (dateStr: string): boolean => {
  if (!dateStr) return false;
  
  // Check basic format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  
  // Check if it's a valid date
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};
