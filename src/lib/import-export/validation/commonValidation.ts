
import { supabase } from '@/lib/supabase';
import { ValidationResult } from './types';

/**
 * Validates if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
  if (!email) return true; // Allow empty
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(email).toLowerCase());
}

/**
 * Validates if a value is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value !== undefined && value !== null && value.trim() !== '';
}

/**
 * Validates if a value is a valid number
 */
export function isValidNumber(value: string | number): boolean {
  if (value === undefined || value === null || value === '') return true; // Allow empty
  return !isNaN(Number(value));
}

/**
 * Validates if a value is a valid date
 */
export function isValidDate(value: string): boolean {
  if (!value) return true; // Allow empty
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Validates if a value is a valid status
 */
export function isValidStatus(value: string, validStatuses: string[]): boolean {
  if (!value) return true; // Allow empty
  return validStatuses.includes(value.toLowerCase());
}

/**
 * Checks if an entity exists in the database
 */
export async function entityExists(entityType: string, field: string, value: string): Promise<boolean> {
  try {
    if (!value) return false;
    
    // Use direct table name instead of dynamic parameter
    let tableName = '';
    
    // Map entityType to actual table names
    switch(entityType) {
      case 'client':
        tableName = 'clients';
        break;
      case 'site':
        tableName = 'sites';
        break;
      case 'contractor':
        tableName = 'contractors';
        break;
      case 'user':
        tableName = 'user_profiles';
        break;
      default:
        console.error(`Unknown entity type: ${entityType}`);
        return false;
    }
    
    // Check if entity exists
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq(field, value)
      .limit(1);
      
    if (error) {
      console.error(`Error checking if ${entityType} exists:`, error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error in entityExists for ${entityType}:`, error);
    return false;
  }
}

/**
 * Creates a validation result
 */
export function createValidationResult<T>(
  success: boolean, 
  errors: Record<string, string> = {},
  data?: T[]
): ValidationResult<T> {
  return {
    success,
    errors,
    data
  };
}
