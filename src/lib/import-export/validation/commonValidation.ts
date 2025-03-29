
import { supabase } from '@/lib/supabase';
import { ValidationError, ValidationResult } from '../types';
import { z } from 'zod';

/**
 * Check if an email is valid
 * @param email Email to validate
 * @returns True if valid
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Check if a date is in valid format (YYYY-MM-DD)
 * @param dateStr Date string to validate
 * @returns True if valid
 */
export function isValidDateFormat(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/**
 * Check if a record exists by a specific field value
 * @param table Database table name
 * @param field Field name to check
 * @param value Value to check
 * @returns True if exists
 */
export async function recordExistsByField(table: string, field: string, value: any): Promise<boolean> {
  try {
    const { data, error, count } = await supabase
      .from(table)
      .select('id', { count: 'exact' })
      .eq(field, value)
      .limit(1);
      
    if (error) throw error;
    
    return (count || 0) > 0;
  } catch (error) {
    console.error(`Error checking if ${field} exists in ${table}:`, error);
    return false;
  }
}

/**
 * Check if multiple records exist by a specific field value
 * @param table Database table name
 * @param field Field name to check
 * @param values Array of values to check
 * @returns Array of values that exist
 */
export async function recordsExistByField(table: string, field: string, values: any[]): Promise<any[]> {
  if (!values || values.length === 0) return [];
  
  try {
    const { data, error } = await supabase
      .from(table)
      .select(field)
      .in(field, values);
      
    if (error) throw error;
    
    return data?.map(item => item[field]) || [];
  } catch (error) {
    console.error(`Error checking if ${field} values exist in ${table}:`, error);
    return [];
  }
}

/**
 * Validate required fields in an object
 * @param obj Object to validate
 * @param requiredFields Array of required field names
 * @returns Array of validation errors
 */
export function validateRequiredFields(obj: any, requiredFields: string[]): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
      errors.push({
        field,
        message: `${field} is required`,
        value: obj[field]
      });
    }
  }
  
  return errors;
}

/**
 * Validate data using a Zod schema
 * @param schema Zod schema
 * @param data Data to validate
 * @returns Validation result
 */
export function validateWithZod<T>(schema: z.ZodSchema<T>, data: any): ValidationResult {
  try {
    const validatedData = schema.parse(data);
    return {
      valid: true,
      errors: [],
      validData: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.path.reduce((obj, key) => obj && obj[key], data)
        }))
      };
    }
    
    return {
      valid: false,
      errors: [{
        field: 'general',
        message: error instanceof Error ? error.message : 'Validation failed'
      }]
    };
  }
}

/**
 * Simplify validation errors into a string array
 * @param errors Array of validation errors
 * @returns Array of error strings
 */
export function simplifyValidationErrors(errors: ValidationError[]): string[] {
  return errors.map(err => `${err.field}: ${err.message}`);
}

/**
 * Generic data validation function
 * @param data Data to validate
 * @param schema Zod schema
 * @param options Validation options
 * @returns Validation result
 */
export async function validateGenericData<T>(
  data: any[],
  schema: z.ZodSchema<T>,
  options?: { tableName?: string, uniqueField?: string }
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const validData: T[] = [];
  
  // Validate each item with the schema
  for (let i = 0; i < data.length; i++) {
    try {
      const validatedItem = schema.parse(data[i]);
      validData.push(validatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          errors.push({
            field: err.path.join('.'),
            message: err.message,
            rowIndex: i,
            value: err.path.reduce((obj, key) => obj && obj[key], data[i])
          });
        });
      } else {
        errors.push({
          field: 'general',
          message: error instanceof Error ? error.message : 'Validation failed',
          rowIndex: i
        });
      }
    }
  }
  
  // Check for duplicates in the unique field
  if (options?.uniqueField && options.tableName) {
    const uniqueValues = data
      .map(item => item[options.uniqueField!])
      .filter(value => value !== undefined && value !== null && value !== '');
      
    if (uniqueValues.length > 0) {
      const exists = await recordsExistByField(
        options.tableName,
        options.uniqueField,
        uniqueValues
      );
      
      if (exists.length > 0) {
        for (let i = 0; i < data.length; i++) {
          const value = data[i][options.uniqueField!];
          if (value && exists.includes(value)) {
            errors.push({
              field: options.uniqueField,
              message: `${options.uniqueField} already exists: ${value}`,
              rowIndex: i,
              value
            });
          }
        }
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    validData: errors.length === 0 ? validData : undefined
  };
}
