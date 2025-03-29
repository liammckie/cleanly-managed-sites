
/**
 * Utilities for formatting and simplifying validation errors
 */
import { ValidationError, ValidationResult } from '@/lib/types/validationTypes';
import { z } from 'zod';

/**
 * Simplify validation errors to string messages
 */
export const simplifyValidationErrors = (errors: ValidationError[]): string[] => {
  return errors.map(error => `${error.field}: ${error.message}`);
};

/**
 * Convert validation result to form-friendly error object
 */
export const validationResultToFormErrors = (result: ValidationResult): Record<string, string> => {
  if (result.valid) {
    return {};
  }
  
  const errors: Record<string, string> = {};
  
  result.errors.forEach(error => {
    errors[error.field] = error.message;
  });
  
  return errors;
};

/**
 * Convert Zod errors to our standard format
 * @param error Zod error object
 * @returns Array of ValidationError objects
 */
export const zodToValidationErrors = (error: z.ZodError): ValidationError[] => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};

/**
 * Convert Zod validation result to our standard format
 */
export const zodResultToValidationResult = <T>(
  result: z.SafeParseReturnType<any, T>
): ValidationResult & { data?: T } => {
  if (result.success) {
    return {
      valid: true,
      errors: [],
      data: result.data
    };
  } else {
    return {
      valid: false,
      errors: zodToValidationErrors(result.error)
    };
  }
};
