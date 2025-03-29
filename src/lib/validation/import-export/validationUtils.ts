
import { supabase } from '@/lib/supabase';
import { ValidationError, ValidationResult } from '@/lib/types/importExport';

/**
 * Check if a record exists in a table by a field value
 */
export const recordExistsByField = async (
  tableName: string, 
  fieldName: string, 
  value: string | number
): Promise<boolean> => {
  if (!value) return false;
  
  try {
    // Use a type assertion to work around the typed table restriction
    const { data, error } = await supabase
      .from(tableName as any)
      .select('id')
      .eq(fieldName, value)
      .limit(1);
      
    if (error) throw error;
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking record existence in ${tableName}:`, error);
    return false;
  }
};

/**
 * Check if a value is a valid email format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return true; // Empty is valid (for optional emails)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if a value is a valid date format (YYYY-MM-DD)
 */
export const isValidDateFormat = (date: string): boolean => {
  if (!date) return true; // Empty is valid (for optional dates)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

/**
 * Validate required fields in an object
 */
export const validateRequiredFields = (
  data: any,
  requiredFields: string[]
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  requiredFields.forEach(field => {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push({
        field,
        message: `${field} is required`
      });
    }
  });
  
  return errors;
};

/**
 * Simplify validation errors into a more readable format
 */
export const simplifyValidationErrors = (errors: any[]): string[] => {
  return errors.map(err => 
    typeof err === 'object' && err.field && err.message
      ? `${err.field}: ${err.message}`
      : String(err)
  );
};
