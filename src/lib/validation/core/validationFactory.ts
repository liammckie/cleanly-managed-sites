
/**
 * Validation factory pattern for easily creating validation functions
 * for different schemas and use cases
 */
import { z } from 'zod';
import { validateWithZod } from '../index';
import { ValidationResult, ZodValidationResult } from '@/lib/types/validationTypes';

export interface ValidationFactoryOptions<T> {
  schema: z.ZodSchema<T>;
  errorMapper?: (errors: Record<string, string>) => Record<string, string>;
  transformResult?: (result: ZodValidationResult<T>) => ValidationResult;
}

/**
 * Create a validation function for a specific schema
 */
export function createValidator<T>(options: ValidationFactoryOptions<T>) {
  const { schema, errorMapper, transformResult } = options;
  
  return (data: any): ValidationResult & { data?: T } => {
    // Validate with the provided schema
    const result = validateWithZod<T>(schema, data);
    
    // Apply custom error mapping if provided
    if (!result.success && result.errors && errorMapper) {
      result.errors = errorMapper(result.errors);
    }
    
    // Transform the result if a transformer is provided
    if (transformResult) {
      return transformResult(result);
    }
    
    // Default transformation to standard ValidationResult
    return {
      valid: result.success,
      errors: !result.success && result.errors 
        ? Object.entries(result.errors).map(([field, message]) => ({
            field,
            message: message || 'Invalid value'
          }))
        : [],
      data: result.data
    };
  };
}

/**
 * Create a form validator that returns simple error records for React form integration
 */
export function createFormValidator<T>(schema: z.ZodSchema<T>) {
  return (data: any): { isValid: boolean; errors: Record<string, string>; data?: T } => {
    const result = validateWithZod<T>(schema, data);
    
    return {
      isValid: result.success,
      errors: result.success ? {} : (result.errors || {}),
      data: result.data
    };
  };
}
