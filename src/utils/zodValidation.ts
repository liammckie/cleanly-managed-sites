
import { z } from 'zod';

/**
 * Validates data against a Zod schema and returns formatted errors
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @returns An object with success flag, formatted errors, and validated data
 */
export function validateWithZod<T>(schema: z.ZodType<T>, data: unknown): {
  success: boolean;
  errors: Record<string, string>;
  data?: T;
} {
  try {
    const result = schema.safeParse(data);
    
    if (!result.success) {
      // Format error messages
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach(error => {
        const path = error.path.join('.');
        formattedErrors[path] = error.message;
      });
      
      return {
        success: false,
        errors: formattedErrors
      };
    }
    
    return {
      success: true,
      errors: {},
      data: result.data
    };
  } catch (error) {
    console.error('Error in validateWithZod:', error);
    return {
      success: false,
      errors: { '_general': 'An unexpected validation error occurred' }
    };
  }
}

/**
 * Formats a Zod error for display in forms
 * @param error The Zod error to format
 * @returns A record of field names to error messages
 */
export function formatZodError(error: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  error.errors.forEach(err => {
    const path = err.path.join('.');
    formattedErrors[path] = err.message;
  });
  
  return formattedErrors;
}

/**
 * Creates a validator function from a Zod schema
 * @param schema The Zod schema to create a validator from
 * @returns A function that validates against the schema
 */
export function createZodValidator<T>(schema: z.ZodType<T>) {
  return (data: unknown) => validateWithZod(schema, data);
}
