
/**
 * Validation related type definitions
 */

/**
 * Error record for validation failures
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  row?: number;
}

/**
 * Validation message with type (error, warning, info)
 */
export interface ValidationMessage {
  field: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
}

/**
 * Standard validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationMessage[];
  message?: string;
  validData?: any[];
}

/**
 * Options for validation
 */
export interface ValidationOptions {
  skipRequiredFields?: boolean;
  additionalValidation?: (data: any) => ValidationError[];
  skipValidation?: boolean;
  checkDuplicates?: boolean;
  updateExisting?: boolean;
  ignoreErrors?: boolean;
  idField?: string;
}

/**
 * Legacy validation result format (for backward compatibility)
 */
export interface LegacyValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Zod-based validation result
 */
export interface ZodValidationResult<T = any> {
  success: boolean;
  errors?: ValidationError[];
  data?: T;
}

/**
 * Convert between validation result formats
 */
export function legacyToNewValidationResult(legacy: LegacyValidationResult): ValidationResult {
  return {
    valid: legacy.isValid,
    errors: legacy.errors.map(msg => ({ field: 'unknown', message: msg })),
    warnings: legacy.warnings?.map(msg => ({ field: 'unknown', message: msg, type: 'warning' }))
  };
}

export function newToLegacyValidationResult(result: ValidationResult): LegacyValidationResult {
  return {
    isValid: result.valid,
    errors: result.errors.map(err => `${err.field}: ${err.message}`),
    warnings: result.warnings?.map(warn => `${warn.field}: ${warn.message}`)
  };
}
