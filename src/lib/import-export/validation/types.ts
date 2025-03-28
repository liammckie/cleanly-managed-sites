
/**
 * Validation error structure for providing feedback on specific fields
 */
export interface ValidationError {
  path: string;
  message: string;
  row?: number;
  value?: any;
}

/**
 * User-friendly validation message
 */
export interface ValidationMessage {
  message: string;
  type: 'error' | 'warning' | 'info';
}

/**
 * Options for validation
 */
export interface ValidationOptions {
  allowPartial?: boolean;
  ignoreExtraFields?: boolean;
}

/**
 * Standardized validation result object
 */
export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: ValidationError[];
  warnings?: ValidationError[];
}

/**
 * Legacy validation result for backward compatibility
 */
export interface LegacyValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: any;
}

/**
 * Zod validation result structure
 */
export interface ZodValidationResult {
  success: boolean;
  errors?: Record<string, string>;
  data?: any;
}

/**
 * Convert legacy validation format to new format
 */
export function legacyToNewValidationResult<T>(legacy: LegacyValidationResult): ValidationResult<T> {
  return {
    valid: legacy.isValid,
    data: legacy.data as T,
    errors: legacy.errors.map(msg => ({ path: 'unknown', message: msg })),
    warnings: legacy.warnings.map(msg => ({ path: 'unknown', message: msg }))
  };
}

/**
 * Convert new validation format to legacy format
 */
export function newToLegacyValidationResult(result: ValidationResult<any>): LegacyValidationResult {
  return {
    isValid: result.valid,
    data: result.data,
    errors: (result.errors || []).map(err => `${err.path}: ${err.message}`),
    warnings: (result.warnings || []).map(err => `${err.path}: ${err.message}`)
  };
}
