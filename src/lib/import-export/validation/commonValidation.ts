
import { ValidationError } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Validates that an email is in a valid format
 * @param email The email to validate
 * @param fieldName The field name for error context
 * @param rowIndex Optional row index for error context
 * @returns ValidationError or null if valid
 */
export function validateEmail(email: string, fieldName: string, rowIndex?: number): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || emailRegex.test(email)) {
    return null;
  }
  
  return {
    path: fieldName,
    message: 'Invalid email address format',
    row: rowIndex,
    value: email
  };
}

/**
 * Validates that a date is in a valid format (YYYY-MM-DD)
 * @param date The date string to validate
 * @param fieldName The field name for error context
 * @param rowIndex Optional row index for error context
 * @returns ValidationError or null if valid
 */
export function validateDateFormat(date: string, fieldName: string, rowIndex?: number): ValidationError | null {
  if (!date) return null;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return {
      path: fieldName,
      message: 'Date must be in YYYY-MM-DD format',
      row: rowIndex,
      value: date
    };
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return {
      path: fieldName,
      message: 'Invalid date',
      row: rowIndex,
      value: date
    };
  }
  
  return null;
}

/**
 * Generic data validation function that can be used for multiple data types
 * @param data The data array to validate
 * @param requiredFields Array of required field names
 * @param customValidator Optional custom validation function
 * @param options Validation options
 * @returns ValidationResult
 */
export function validateGenericData<T>(
  data: any[],
  requiredFields: string[],
  customValidator?: (item: any, index: number) => ValidationError[],
  options?: { ignoreEmptyRows?: boolean; requireAllFields?: boolean }
): {
  valid: boolean;
  data: Partial<T>[];
  errors?: ValidationError[];
  warnings?: ValidationError[];
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const validData: Partial<T>[] = [];
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    errors.push({
      path: 'data',
      message: 'No data provided or data is not an array'
    });
    return { valid: false, data: [], errors };
  }
  
  data.forEach((item, index) => {
    const rowErrors: ValidationError[] = [];
    const rowWarnings: ValidationError[] = [];
    
    // Skip empty rows if configured
    if (options?.ignoreEmptyRows && Object.keys(item).length === 0) {
      return;
    }
    
    // Validate required fields
    requiredFields.forEach(field => {
      if (item[field] === undefined || item[field] === null || item[field] === '') {
        rowErrors.push({
          path: field,
          message: `${field} is required`,
          row: index,
          value: item[field]
        });
      }
    });
    
    // Run custom validator if provided
    if (customValidator) {
      const customErrors = customValidator(item, index);
      rowErrors.push(...customErrors);
    }
    
    // Add errors and warnings for this row
    errors.push(...rowErrors);
    warnings.push(...rowWarnings);
    
    // Add to valid data if no errors (or if not requiring all fields)
    if (rowErrors.length === 0 || !options?.requireAllFields) {
      validData.push(item as Partial<T>);
    }
  });
  
  return {
    valid: errors.length === 0,
    data: validData,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}
