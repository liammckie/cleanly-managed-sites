
// Export validation types and functions
export * from './validation';

// Export utility functions
export { parseCSV } from './parseCSV';
export { setupTestData } from './setupTestData';
export { generateCSV, generateTemplateCSV } from './csvGenerator';
export { convertCSVToClientFormat, convertCSVToSiteFormat, convertCSVToContractFormat, convertCSVToContractorFormat } from './fileFormatConversion';

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
export { importContracts as importContractsLegacy } from './contractImport';
export { importContractors as importContractorsLegacy } from './contractorImport';
export { importSites as importSitesLegacy } from './siteImport';
export { importInvoices as importInvoicesLegacy } from './invoiceImport';

// Export types
export type {
  ImportOptions,
  ImportResult,
  ExportOptions,
  DataType,
  ClientImportItem,
  ContractorRecord,
  InvoiceRecord,
  InvoiceLineItem,
  ValidationError,
  ValidationMessage,
  ValidationResult,
  ValidationOptions,
  LegacyValidationResult
} from './types';
