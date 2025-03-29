
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDateFormat(date: string): boolean {
  if (!date) return true; // Allow empty
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  // Check if it's a valid date
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

/**
 * Check if a record exists by field value
 */
export async function recordExistsByField<T>(
  table: string,
  field: string,
  value: string | number
): Promise<boolean> {
  if (!value) return false;
  
  try {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq(field, value);
      
    if (error) {
      console.error(`Error checking if ${field}=${value} exists in ${table}:`, error);
      return false;
    }
    
    return (count || 0) > 0;
  } catch (error) {
    console.error(`Error checking if ${field}=${value} exists in ${table}:`, error);
    return false;
  }
}

// Simple helper to validate required fields
export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): Record<string, string> {
  const errors: Record<string, string> = {};
  
  for (const field of requiredFields) {
    if (!data[field]) {
      errors[field] = `${field} is required`;
    }
  }
  
  return errors;
}

// Generic validation function using Zod schema
export function validateWithZod<T>(schema: z.ZodType<T>, data: any): { success: boolean; data?: T; errors?: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

// Check if records exist by custom field
export async function recordsExistByField<T>(
  table: string,
  field: string,
  values: (string | number)[]
): Promise<Record<string, boolean>> {
  if (!values.length) return {};
  
  const uniqueValues = [...new Set(values)]; // Remove duplicates
  const result: Record<string, boolean> = {};
  
  try {
    const { data, error } = await supabase
      .from(table)
      .select(field)
      .in(field, uniqueValues);
      
    if (error) {
      console.error(`Error checking if values exist in ${table}.${field}:`, error);
      return uniqueValues.reduce((acc, val) => {
        acc[String(val)] = false;
        return acc;
      }, {} as Record<string, boolean>);
    }
    
    // Mark which values exist
    const existingValues = new Set((data || []).map(item => String(item[field])));
    
    return uniqueValues.reduce((acc, val) => {
      acc[String(val)] = existingValues.has(String(val));
      return acc;
    }, {} as Record<string, boolean>);
  } catch (error) {
    console.error(`Error checking if values exist in ${table}.${field}:`, error);
    return uniqueValues.reduce((acc, val) => {
      acc[String(val)] = false;
      return acc;
    }, {} as Record<string, boolean>);
  }
}

// Convert validation errors to simple format
export function simplifyValidationErrors<T>(errors: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  
  errors.errors.forEach(err => {
    const path = err.path.join('.');
    result[path] = err.message;
  });
  
  return result;
}

// Type for validation error
export interface ValidationError {
  field: string;
  message: string;
}

// Type for validation result
export interface ValidationResult<T> {
  valid: boolean;
  errors: ValidationError[];
  data: T[];
}

// Wrapper for the above functions to validate generic data
export function validateGenericData<T>(
  data: T[],
  requiredFields: string[],
  schema?: z.ZodType<T>
): ValidationResult<T> {
  const errors: ValidationError[] = [];
  const validData: T[] = [];
  
  data.forEach((item, index) => {
    // Check required fields
    const requiredErrors = validateRequiredFields(item as Record<string, any>, requiredFields);
    
    Object.entries(requiredErrors).forEach(([field, message]) => {
      errors.push({
        field: `${index}.${field}`,
        message
      });
    });
    
    // Validate with schema if provided
    if (schema) {
      const schemaResult = schema.safeParse(item);
      if (!schemaResult.success) {
        const schemaErrors = simplifyValidationErrors(schemaResult.error);
        Object.entries(schemaErrors).forEach(([field, message]) => {
          errors.push({
            field: `${index}.${field}`,
            message
          });
        });
      }
    }
    
    // If no errors, add to valid data
    if (Object.keys(requiredErrors).length === 0) {
      validData.push(item);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    data: validData
  };
}
