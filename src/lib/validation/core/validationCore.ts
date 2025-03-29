
/**
 * Core validation utilities that serve as the foundation for all validation in the system
 */
import { z } from 'zod';
import { ValidationError, ValidationResult } from '@/lib/types/validationTypes';

/**
 * Create an empty validation result
 */
export const createValidationResult = (): ValidationResult => ({
  valid: true,
  errors: []
});

/**
 * Add an error to a validation result
 */
export const addError = (result: ValidationResult, field: string, message: string): ValidationResult => {
  result.errors.push({ field, message });
  result.valid = false;
  return result;
};

/**
 * Add a warning to a validation result
 */
export const addWarning = (result: ValidationResult, field: string, message: string, type: string = 'warning'): ValidationResult => {
  if (!result.warnings) {
    result.warnings = [];
  }
  result.warnings.push({ field, message, type });
  return result;
};

/**
 * Merge multiple validation results into one
 */
export const mergeValidationResults = (results: ValidationResult[]): ValidationResult => {
  return {
    valid: results.every(r => r.valid),
    errors: results.flatMap(r => r.errors),
    warnings: results.flatMap(r => r.warnings || []),
    validData: results.flatMap(r => r.validData || [])
  };
};

/**
 * Format Zod validation errors to our standard format
 */
export const formatZodErrors = (zodError: z.ZodError): ValidationError[] => {
  return zodError.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};

/**
 * Validate data against a Zod schema
 */
export function validateWithZod<T>(schema: z.ZodSchema, data: unknown): { 
  success: boolean; 
  data?: T;
  errors?: Record<string, string>;
} {
  try {
    const result = schema.parse(data);
    return {
      success: true,
      data: result as T
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format zod errors into a more usable structure
      const formattedErrors: Record<string, string> = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        formattedErrors[path] = err.message;
      });
      
      return {
        success: false,
        errors: formattedErrors
      };
    }
    
    return {
      success: false,
      errors: { _general: 'Unknown validation error occurred' }
    };
  }
}

/**
 * Validate required fields in an object
 */
export const validateRequiredFields = (
  data: any,
  requiredFields: string[]
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  requiredFields.forEach(field => {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push({
        field,
        message: `${field} is required`
      });
    }
  });
  
  return errors;
};
