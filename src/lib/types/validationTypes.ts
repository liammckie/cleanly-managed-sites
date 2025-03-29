
/**
 * Validation types for import/export and form validation
 */

// Basic validation error
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Validation message with type
export interface ValidationMessage {
  type: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
}

// Basic validation result
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationMessage[];
}

// Options for validation
export interface ValidationOptions {
  validateOnly?: boolean;
  strictMode?: boolean;
  ignoreWarnings?: boolean;
  checkDuplicates?: boolean;
}

// Legacy validation result type for backward compatibility
export interface LegacyValidationResult {
  isValid: boolean;
  messages: ValidationMessage[];
}

// Zod validation result for schema-based validation
export interface ZodValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

// Conversion functions between validation result formats
export function legacyToNewValidationResult(legacy: LegacyValidationResult): ValidationResult {
  return {
    valid: legacy.isValid,
    errors: legacy.messages
      .filter(m => m.type === 'error')
      .map(m => ({ field: m.field || '', message: m.message })),
    warnings: legacy.messages.filter(m => m.type !== 'error')
  };
}

export function newToLegacyValidationResult(result: ValidationResult): LegacyValidationResult {
  const messages: ValidationMessage[] = [
    ...result.errors.map(e => ({ type: 'error' as const, message: e.message, field: e.field })),
    ...(result.warnings || [])
  ];
  
  return {
    isValid: result.valid,
    messages
  };
}
