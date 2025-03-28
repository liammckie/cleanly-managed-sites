/**
 * Standardized validation types for the import-export module
 */

export interface ValidationError {
  path: string;
  message: string;
  row?: number;
  value?: any;
}

export interface ValidationMessage {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  row?: number;
  value?: any;
}

export interface ValidationResult<T = unknown> {
  valid: boolean;
  data?: T;
  errors?: ValidationError[];
  warnings?: ValidationError[];
  messages?: ValidationMessage[];
}

export interface ValidationOptions {
  requireAllFields?: boolean;
  ignoreEmptyRows?: boolean;
}

// Add Zod validation integration for future use
export type ZodValidationResult<T = unknown> = ValidationResult<T>;

// Legacy validation structure compatibility layer - keeping for backwards compatibility
export interface LegacyValidationResult<T = unknown> {
  isValid: boolean;
  data?: T;
  errors?: ValidationError[];
  warnings?: ValidationError[];
}

// Cross-mapping functions to help with legacy code
export function legacyToNewValidationResult<T>(legacy: LegacyValidationResult<T>): ValidationResult<T> {
  return {
    valid: legacy.isValid,
    data: legacy.data,
    errors: legacy.errors,
    warnings: legacy.warnings
  };
}

export function newToLegacyValidationResult<T>(result: ValidationResult<T>): LegacyValidationResult<T> {
  return {
    isValid: result.valid,
    data: result.data,
    errors: result.errors,
    warnings: result.warnings as ValidationError[]
  };
}
