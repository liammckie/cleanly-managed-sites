
/**
 * Add a warning to a validation result
 */
export const addWarning = (
  result: ValidationResult, 
  field: string, 
  message: string, 
  type: 'error' | 'warning' | 'info' = 'warning'
): ValidationResult => {
  if (!result.warnings) {
    result.warnings = [];
  }
  result.warnings.push({ field, message, type });
  return result;
};
