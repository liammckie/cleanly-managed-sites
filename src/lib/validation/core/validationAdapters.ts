
/**
 * Adapters for converting between different validation result formats
 */
import { 
  ValidationResult, 
  ValidationError, 
  LegacyValidationResult,
  ZodValidationResult
} from '@/lib/types/validationTypes';

/**
 * Convert from legacy validation result format to standard validation result
 */
export function legacyToStandardValidationResult(legacy: LegacyValidationResult): ValidationResult {
  return {
    valid: legacy.isValid,
    errors: legacy.errors.map(msg => ({ field: 'unknown', message: msg })),
    warnings: legacy.warnings?.map(msg => ({ field: 'unknown', message: msg, type: 'warning' }))
  };
}

/**
 * Convert from standard validation result format to legacy format
 */
export function standardToLegacyValidationResult(result: ValidationResult): LegacyValidationResult {
  return {
    isValid: result.valid,
    errors: result.errors.map(err => `${err.field}: ${err.message}`),
    warnings: result.warnings?.map(warn => `${warn.field}: ${warn.message}`)
  };
}

/**
 * Convert Zod validation result to standard validation result format
 */
export function zodToStandardValidationResult<T>(result: ZodValidationResult<T>): ValidationResult & { data?: T } {
  if (result.success) {
    return {
      valid: true,
      errors: [],
      data: result.data
    };
  } else {
    return {
      valid: false,
      errors: Object.entries(result.errors || {}).map(([field, message]) => ({
        field,
        message: message || 'Invalid value'
      }))
    };
  }
}

/**
 * Convert error object to validation errors array
 */
export function errorObjectToValidationErrors(errors: Record<string, string>): ValidationError[] {
  return Object.entries(errors).map(([field, message]) => ({
    field,
    message
  }));
}
