
/**
 * Error format for validation errors
 */
export interface ValidationError {
  field: string;
  message: string;
  rowIndex?: number;
  value?: any;
}

/**
 * Message format for validation messages
 */
export interface ValidationMessage {
  type: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
  rowIndex?: number;
}

/**
 * Options for validation functions
 */
export interface ValidationOptions {
  checkExisting?: boolean;
  isUpdate?: boolean;
}

/**
 * Result from validation functions
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationMessage[];
  validData?: any[];
}

/**
 * Result from Zod validation
 */
export interface ZodValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationMessage[];
  validData?: any[];
}

/**
 * Legacy validation result format for backward compatibility
 */
export interface LegacyValidationResult {
  valid: boolean;
  errors: string[];
  data?: any[];
}

/**
 * Convert from legacy validation format to new format
 */
export function legacyToNewValidationResult(legacy: LegacyValidationResult): ValidationResult {
  return {
    valid: legacy.valid,
    errors: legacy.errors.map(error => ({
      field: 'general',
      message: error
    })),
    validData: legacy.data
  };
}

/**
 * Convert from new validation format to legacy format
 */
export function newToLegacyValidationResult(result: ValidationResult): LegacyValidationResult {
  return {
    valid: result.valid,
    errors: result.errors.map(error => `${error.field}: ${error.message}`),
    data: result.validData
  };
}
