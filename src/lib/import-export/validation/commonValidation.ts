
import { supabase } from '@/lib/supabase';
import { ValidationError, ValidationResult } from './types';

/**
 * Checks if records with the given IDs already exist in the specified table
 * @param table The table name to check
 * @param ids The array of IDs to check
 * @returns An array of IDs that already exist in the table
 */
export async function checkExistingItems(table: string, ids: string[]): Promise<string[]> {
  if (!ids || ids.length === 0) return [];
  
  try {
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .in('id', ids);
    
    if (error) {
      console.error(`Error checking existing ${table}:`, error);
      return [];
    }
    
    return data?.map(item => item.id as string) || [];
  } catch (error) {
    console.error(`Error checking existing ${table}:`, error);
    return [];
  }
}

/**
 * Generic validation function that can be used by specific entity validators
 * @param data The data to validate
 * @param requiredFields An array of required field names
 * @param validateItem Optional custom validation function for each item
 * @returns A validation result
 */
export function validateGenericData<T>(
  data: any[],
  requiredFields: string[] = [],
  validateItem?: (item: any, index: number) => ValidationError[]
): ValidationResult<T[]> {
  if (!Array.isArray(data)) {
    return {
      valid: false,
      errors: [{ path: '', message: 'Data must be an array' }]
    };
  }
  
  if (data.length === 0) {
    return {
      valid: true,
      data: [] as unknown as T[],
      messages: [{ type: 'info', field: '', message: 'No data to validate' }]
    };
  }
  
  const errors: ValidationError[] = [];
  const validItems: any[] = [];
  
  data.forEach((item, index) => {
    const itemErrors: ValidationError[] = [];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!item[field] && item[field] !== 0 && item[field] !== false) {
        itemErrors.push({
          path: field,
          message: `${field} is required`,
          row: index,
          value: item[field]
        });
      }
    });
    
    // Run custom validation if provided
    if (validateItem) {
      const customErrors = validateItem(item, index);
      if (customErrors && customErrors.length > 0) {
        itemErrors.push(...customErrors);
      }
    }
    
    if (itemErrors.length > 0) {
      errors.push(...itemErrors);
    } else {
      validItems.push(item);
    }
  });
  
  return {
    valid: errors.length === 0,
    data: validItems as T[],
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Validates that a value is a date string in the format YYYY-MM-DD
 * @param value The value to validate
 * @param field The field name for error messages
 * @param row Optional row number for error messages
 * @returns A validation error or null if valid
 */
export function validateDateFormat(value: any, field: string, row?: number): ValidationError | null {
  if (!value) return null; // Empty is handled by required field validation
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) {
    return {
      path: field,
      message: `${field} must be in the format YYYY-MM-DD`,
      row,
      value
    };
  }
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return {
      path: field,
      message: `${field} must be a valid date`,
      row,
      value
    };
  }
  
  return null;
}

/**
 * Validates that a value is a number
 * @param value The value to validate
 * @param field The field name for error messages
 * @param row Optional row number for error messages
 * @returns A validation error or null if valid
 */
export function validateNumber(value: any, field: string, row?: number): ValidationError | null {
  if (value === undefined || value === null || value === '') return null;
  
  if (isNaN(Number(value))) {
    return {
      path: field,
      message: `${field} must be a number`,
      row,
      value
    };
  }
  
  return null;
}

/**
 * Validates that a value is a valid email address
 * @param value The value to validate
 * @param field The field name for error messages
 * @param row Optional row number for error messages
 * @returns A validation error or null if valid
 */
export function validateEmail(value: any, field: string, row?: number): ValidationError | null {
  if (!value) return null; // Empty is handled by required field validation
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return {
      path: field,
      message: `${field} must be a valid email address`,
      row,
      value
    };
  }
  
  return null;
}
