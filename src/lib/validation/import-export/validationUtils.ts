
/**
 * Specialized validation utilities for import/export operations
 */
import { supabase } from '@/lib/supabase';
import { createValidationResult, addError, addWarning } from '../core/validationCore';
import { ValidationResult, ValidationOptions } from '@/lib/types/validationTypes';

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
 * Check if a record exists in the database by a field
 */
export const recordExistsByField = async (
  tableName: string, 
  fieldName: string, 
  value: any
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq(fieldName, value)
      .limit(1);
      
    if (error) {
      throw error;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking if record exists in ${tableName}:`, error);
    return false;
  }
};

/**
 * Validate imported data batch against a schema with additional custom validations
 */
export const validateImportBatch = async <T>(
  data: any[],
  validateFn: (item: any) => Promise<ValidationResult> | ValidationResult,
  options: ValidationOptions = {}
): Promise<ValidationResult & { validData: T[] }> => {
  const result = createValidationResult();
  const validData: T[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const itemResult = await validateFn(item);
    
    if (!itemResult.valid) {
      itemResult.errors.forEach(err => {
        addError(
          result, 
          `items[${i}].${err.field}`, 
          err.message
        );
      });
    } else if (itemResult.valid && itemResult.validData) {
      validData.push(itemResult.validData as unknown as T);
    } else if (itemResult.valid) {
      validData.push(item as T);
    }
    
    // Add warnings if any
    if (itemResult.warnings && itemResult.warnings.length > 0) {
      itemResult.warnings.forEach(warning => {
        addWarning(
          result,
          `items[${i}].${warning.field}`,
          warning.message,
          warning.type
        );
      });
    }
  }
  
  // If we have any errors, mark the result as invalid
  result.valid = result.errors.length === 0;
  
  // Add valid data to the result
  return {
    ...result,
    validData
  };
};
