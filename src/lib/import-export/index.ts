
/**
 * Import/Export module
 * Centralizes all import/export related functionality
 */

// Export validation types and functions
export * from './validation';

// Export utility functions
export { parseCSV } from './parseCSV';
export { setupTestData } from './setupTestData';
export { generateCSV, generateTemplateCSV } from './csvGenerator';
export { 
  convertCSVToClientFormat, 
  convertCSVToSiteFormat, 
  convertCSVToContractFormat, 
  convertCSVToContractorFormat 
} from './fileFormatConversion';

// Export import operations
export { 
  importData,
  importClients,
  importContractors,
  importSites,
  importContracts,
  importInvoices
} from './importOperations';

// Export specific import implementations for backward compatibility
export { processClientImport } from './clientImport';

// Export all types from central types module for easy access
export type {
  ImportOptions,
  ImportResult,
  ExportOptions,
  ExportResult,
  DataExportType,
  DataImportType,
  ClientImportItem,
  ContractorImportItem,
  InvoiceImportItem,
  InvoiceLineItem,
  ValidationError,
  ValidationMessage,
  ValidationResult,
  ValidationOptions,
  LegacyValidationResult,
  ZodValidationResult
} from '@/lib/types';

export {
  legacyToNewValidationResult,
  newToLegacyValidationResult
} from '@/lib/types/validationTypes';
