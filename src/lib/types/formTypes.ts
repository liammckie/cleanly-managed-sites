
import { z } from 'zod';

/**
 * Common form validation types
 */

// Basic form validation result
export interface FormValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  errors?: Record<string, string>;
}

// Form field validation error
export interface FormFieldError {
  field: string;
  message: string;
}

// Form validation hook return type
export interface FormValidationHook<T = any> {
  validationErrors: Record<string, string>;
  validateForm: (data: any) => FormValidationResult<T>;
  clearErrors: () => void;
  setFieldError: (field: string, message: string) => void;
  clearFieldError: (field: string) => void;
  hasErrors: boolean;
}

// Form validation options
export interface FormValidationOptions {
  abortEarly?: boolean;
  stripUnknown?: boolean;
  customMessages?: Record<string, string>;
}

// Schema validation function type
export type SchemaValidator<T> = (data: any, options?: FormValidationOptions) => FormValidationResult<T>;

// Function to create a typed schema validator
export function createSchemaValidator<T>(schema: z.ZodSchema<T>): SchemaValidator<T> {
  return (data: any, options?: FormValidationOptions): FormValidationResult<T> => {
    try {
      const parseResult = schema.parse(data);
      return { isValid: true, data: parseResult };
    } catch (error: any) {
      const errors: Record<string, string> = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
      }
      
      return {
        isValid: false,
        errors
      };
    }
  };
}
