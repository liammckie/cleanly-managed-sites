
import { ValidationMessage, EnhancedValidationResult } from '@/types/common';

// Re-export the types from common
export type { ValidationMessage, EnhancedValidationResult };

// Alias ValidationResult to EnhancedValidationResult for backwards compatibility
export type ValidationResult = EnhancedValidationResult;

// Add any additional import-export specific types below
export interface ImportOptions {
  skipValidation?: boolean;
  updateExisting?: boolean;
  dryRun?: boolean;
}

export interface ExportOptions {
  format?: 'json' | 'csv';
  includeRelatedData?: boolean;
}

export interface ImportResult {
  success: boolean;
  created: number;
  updated: number;
  skipped: number;
  errors: ValidationMessage[];
}

export interface ExportResult {
  success: boolean;
  data: any;
  count: number;
  format: string;
}
