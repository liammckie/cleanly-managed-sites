
import { z } from 'zod';
import { ValidationError, ValidationResult, ZodValidationResult } from '@/lib/types/validationTypes';
import { createValidationResult, formatZodErrors } from './validationCore';

/**
 * ValidationFactory provides a consistent way to validate data using Zod schemas
 */
export class ValidationFactory<T> {
  private schema: z.ZodType<T>;
  
  constructor(schema: z.ZodType<T>) {
    this.schema = schema;
  }
  
  /**
   * Validate data using the provided schema
   */
  validate(data: unknown): ValidationResult {
    try {
      const result = this.schema.safeParse(data);
      
      if (result.success) {
        return createValidationResult(true);
      } else {
        const errors = formatZodErrors(result.error);
        return {
          valid: false,
          errors
        };
      }
    } catch (error) {
      return {
        valid: false,
        errors: [{ field: 'general', message: 'Validation failed' }]
      };
    }
  }
  
  /**
   * Convert from Zod validation result to our standard format
   */
  convertResult(result: ZodValidationResult<T>): ValidationResult {
    if (result.success) {
      return createValidationResult(true);
    } else {
      const validationErrors: ValidationError[] = 
        Array.isArray(result.errors) ? result.errors : 
        Object.entries(result.errors || {}).map(([key, value]) => ({
          field: key,
          message: value
        }));
      
      return {
        valid: false,
        errors: validationErrors
      };
    }
  }
}
