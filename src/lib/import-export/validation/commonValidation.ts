
/**
 * Common validation utilities for import/export operations
 */
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// Import types from centralized location
import {
  ValidationError,
  ValidationResult,
  ValidationOptions
} from '@/lib/types';

/**
 * Basic validation result template
 */
export const createValidationResult = (): ValidationResult => ({
  valid: true,
  errors: [],
  warnings: []
});

/**
 * Add an error to a validation result
 */
export const addError = (result: ValidationResult, field: string, message: string): ValidationResult => {
  result.errors.push({ field, message });
  result.valid = false;
  return result;
};

/**
 * Add a warning to a validation result
 */
export const addWarning = (result: ValidationResult, field: string, message: string): ValidationResult => {
  if (!result.warnings) {
    result.warnings = [];
  }
  result.warnings.push({ type: 'warning', field, message });
  return result;
};

/**
 * Check for duplicates in the database
 */
export const checkForDuplicates = async (
  tableName: string,
  field: string,
  value: string,
  idField: string = 'id',
  id?: string
): Promise<boolean> => {
  try {
    let query = supabase.from(tableName).select(idField).eq(field, value);
    
    // If ID is provided, exclude that record
    if (id) {
      query = query.neq(idField, id);
    }
    
    const { data } = await query.limit(1);
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking for duplicates in ${tableName}:`, error);
    return false;
  }
};

/**
 * Format Zod validation errors to our standard format
 */
export const formatZodErrors = (zodError: z.ZodError): ValidationError[] => {
  return zodError.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};
