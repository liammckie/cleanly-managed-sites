
import { 
  ValidationMessage, 
  ValidationResult, 
  EnhancedValidationResult, 
  ValidationError 
} from '@/types/common';

export interface LegacyValidationResult<T = unknown> {
  isValid: boolean;
  data?: T;
  errors?: ValidationError[];
  warnings?: ValidationError[];
}

export interface ImportOptions {
  mapping?: Record<string, string>;
  skipValidation?: boolean;
  skipExistingCheck?: boolean;
  updateExisting?: boolean;
  dryRun?: boolean;
}

export interface ImportResult {
  success: boolean;
  message: string;
  count: number;
  failures?: any[];
  data?: any[];
}

export interface ExportOptions {
  includeHeaders?: boolean;
  format?: 'csv' | 'xlsx' | 'json';
  fileName?: string;
}

// Add cross-mapping functions to help with legacy code
export function legacyToNewValidationResult<T>(legacy: LegacyValidationResult<T>): ValidationResult<T> {
  return {
    valid: legacy.isValid,
    data: legacy.data,
    errors: legacy.errors
  };
}

export function newToLegacyValidationResult<T>(result: ValidationResult<T>): LegacyValidationResult<T> {
  return {
    isValid: result.valid,
    data: result.data,
    errors: result.errors
  };
}
