
import { z } from 'zod';

// Type for validation error
export interface ValidationError {
  field: string;
  message: string;
}

// Type for validation message
export interface ValidationMessage {
  type: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
}

// Type for validation result
export interface ValidationResult<T> {
  valid: boolean;
  errors: ValidationError[];
  data: T[];
}

// Validation options
export interface ValidationOptions {
  skipRequiredFields?: boolean;
  allowUnknownFields?: boolean;
}

// Legacy validation format
export interface LegacyValidationResult {
  isValid: boolean;
  messages: ValidationMessage[];
  data: any;
}

// Zod validation result
export interface ZodValidationResult<T> {
  success: boolean;
  data?: T;
  error?: z.ZodError;
}

// Convert between validation formats
export function legacyToNewValidationResult<T>(legacy: LegacyValidationResult): ValidationResult<T> {
  const errors = legacy.messages
    .filter(m => m.type === 'error')
    .map(m => ({
      field: m.field || '',
      message: m.message
    }));
  
  return {
    valid: legacy.isValid,
    errors,
    data: legacy.data
  };
}

export function newToLegacyValidationResult<T>(result: ValidationResult<T>): LegacyValidationResult {
  const messages = result.errors.map(err => ({
    type: 'error' as const,
    message: err.message,
    field: err.field
  }));
  
  return {
    isValid: result.valid,
    messages,
    data: result.data
  };
}
