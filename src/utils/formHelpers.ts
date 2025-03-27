
import { z } from 'zod';
import { validateWithZod } from './zodValidation';
import { toast } from 'sonner';

/**
 * Higher-order function for form submission with Zod validation
 * @param schema The Zod schema to validate against
 * @param onSubmit Function to call with validated data
 * @returns Function to handle form submission
 */
export function createSubmitHandler<T>(
  schema: z.ZodType<T>,
  onSubmit: (data: T) => void | Promise<void>
) {
  return async (formData: unknown, event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    const result = validateWithZod(schema, formData);
    
    if (!result.success) {
      toast.error('Please fix the validation errors');
      return { success: false, errors: result.errors };
    }
    
    try {
      await onSubmit(result.data as T);
      return { success: true, errors: {} };
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred while submitting the form');
      return { 
        success: false, 
        errors: { '_general': error instanceof Error ? error.message : 'Unknown error' } 
      };
    }
  };
}

/**
 * Creates a validator function for forms to check required fields
 * @param fieldNames Array of required field names
 * @returns Validation function
 */
export function requiredFields(fieldNames: string[]) {
  return (data: Record<string, any>) => {
    const errors: Record<string, string> = {};
    
    fieldNames.forEach(field => {
      const value = data[field];
      if (value === undefined || value === null || value === '') {
        errors[field] = `${field} is required`;
      }
    });
    
    return errors;
  };
}

/**
 * Formats form data for display in error messages
 * @param data The form data
 * @returns Formatted string representation
 */
export function formatFormData(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return String(data);
  }
}
