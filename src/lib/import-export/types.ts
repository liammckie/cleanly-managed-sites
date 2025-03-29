
// Re-export validation types for easier access
export type { 
  ValidationError,
  ValidationMessage,
  ValidationResult,
  ValidationOptions,
  LegacyValidationResult,
  ZodValidationResult
} from './validation/types';

export {
  legacyToNewValidationResult,
  newToLegacyValidationResult
} from './validation/types';

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
  fields?: string[];
}

// Define the DataType for csvGenerator
export type DataType = 'client' | 'site' | 'contractor' | 'invoice' | 'contract';

// Import item types
export { type ClientImportItem, type ContractorRecord, type InvoiceRecord, type InvoiceLineItem } from '@/lib/types/importTypes';
