
/**
 * Re-export validation types for easier access
 * This file is maintained for backward compatibility
 */

// Import and re-export all types from the centralized location
export type { 
  ValidationError,
  ValidationMessage,
  ValidationResult,
  ValidationOptions,
  LegacyValidationResult,
  ZodValidationResult,
  ImportOptions,
  ImportResult,
  ExportOptions,
  DataImportType,
  DataExportType,
  ClientImportItem,
  ContractorImportItem,
  InvoiceImportItem,
  InvoiceLineItem
} from '@/lib/types';

// Re-export conversion functions
export {
  legacyToNewValidationResult,
  newToLegacyValidationResult
} from '@/lib/types/validationTypes';
