
import { ValidationError, ValidationResult } from './types';

/**
 * Validates email format
 * @param email Email to validate
 * @param field Field name
 * @param row Row number (for CSV import)
 * @returns Validation error if invalid, null if valid
 */
export function validateEmail(email: string, field: string, row?: number): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      path: field,
      message: 'Invalid email format',
      row,
      value: email
    };
  }
  return null;
}

/**
 * Validates date format (YYYY-MM-DD)
 * @param date Date string to validate
 * @param field Field name
 * @param row Row number (for CSV import)
 * @returns Validation error if invalid, null if valid
 */
export function validateDateFormat(date: string, field: string, row?: number): ValidationError | null {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return {
      path: field,
      message: 'Invalid date format (should be YYYY-MM-DD)',
      row,
      value: date
    };
  }
  
  // Check if it's a valid date
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    return {
      path: field,
      message: 'Invalid date',
      row,
      value: date
    };
  }
  
  return null;
}

/**
 * Checks for existing items in the database by ID
 * @param table Table name
 * @param ids Array of IDs to check
 * @returns Array of IDs that exist in the database
 */
export async function checkExistingItems(table: string, ids: string[]): Promise<string[]> {
  if (!ids.length) return [];
  
  try {
    const { supabase } = await import('@/lib/supabase');
    const { data } = await supabase
      .from(table)
      .select('id')
      .in('id', ids);
    
    return data ? data.map(item => item.id) : [];
  } catch (error) {
    console.error(`Error checking existing items in ${table}:`, error);
    return [];
  }
}

/**
 * Generic validation function for imported data
 * @param data Data to validate
 * @param requiredFields Array of required field names
 * @param customValidation Optional function for additional validation
 * @returns Validation result
 */
export function validateGenericData<T>(
  data: any[],
  requiredFields: string[],
  customValidation?: (item: any, index: number) => ValidationError[]
): ValidationResult<T[]> {
  if (!Array.isArray(data)) {
    return {
      valid: false,
      errors: [{ path: '', message: 'Invalid data format: must be an array' }]
    };
  }
  
  if (data.length === 0) {
    return {
      valid: false,
      errors: [{ path: '', message: 'No data to import' }]
    };
  }
  
  const errors: ValidationError[] = [];
  const validItems: any[] = [];
  
  data.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      errors.push({
        path: '',
        message: 'Invalid item: must be an object',
        row: index
      });
      return;
    }
    
    const itemErrors: ValidationError[] = [];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (item[field] === undefined || item[field] === null || item[field] === '') {
        itemErrors.push({
          path: field,
          message: `Missing required field: ${field}`,
          row: index,
          value: item[field]
        });
      }
    });
    
    // Run custom validation if provided
    if (customValidation) {
      const customErrors = customValidation(item, index);
      itemErrors.push(...customErrors);
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
