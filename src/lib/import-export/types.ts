
/**
 * Re-export validation types for easier access
 * This file is maintained for backward compatibility
 */
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
  ContractorImportItem as ContractorRecord,
  InvoiceImportItem as InvoiceRecord,
  InvoiceLineItem
} from '../types';

export {
  legacyToNewValidationResult,
  newToLegacyValidationResult
} from '../types/validationTypes';
