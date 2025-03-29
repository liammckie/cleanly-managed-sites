
// Basic validation types
export interface ValidationMessage {
  field: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
}

export interface ValidationError {
  field: string;
  message: string;
  type?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationMessage[];
  data?: any;
}

// Legacy validation result for backward compatibility
export interface LegacyValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  message?: string;
}

// Zod validation result
export interface ZodValidationResult<T> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
}

// Import/export related validation
export interface ImportOptions {
  format?: 'json' | 'csv';
  mode: 'full' | 'incremental';
  updateExisting?: boolean;
  skipValidation?: boolean;
  type?: string;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  includeArchived?: boolean;
  dateRange?: [Date, Date];
  fields?: string[];
}

export interface ImportResult {
  success: boolean;
  errors: string[];
  imported?: number;
  skipped?: number;
  message?: string;
  data?: any[];
}

export interface ExportResult {
  success: boolean;
  errors: string[];
  exported?: number;
  message?: string;
  data?: any;
  filename?: string;
}

// Utility functions for converting between validation result formats
export const legacyToNewValidationResult = (legacy: LegacyValidationResult): ValidationResult => {
  return {
    valid: legacy.isValid,
    errors: legacy.errors?.map(err => ({ field: 'general', message: err })) || [],
    warnings: legacy.warnings?.map(warn => ({ field: 'general', message: warn, type: 'warning' }))
  };
};

export const newToLegacyValidationResult = (result: ValidationResult): LegacyValidationResult => {
  return {
    isValid: result.valid,
    errors: result.errors.map(err => err.message),
    warnings: result.warnings?.map(warn => warn.message),
    message: result.errors.length > 0 ? result.errors[0].message : undefined
  };
};
