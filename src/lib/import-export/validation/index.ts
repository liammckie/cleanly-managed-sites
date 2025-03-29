
/**
 * Export validation functions and types
 */
import { validateClientData } from './clientValidation';
import { validateSiteData } from './siteValidation';
import { validateContractorData } from './contractorValidation';
import { validateContractData } from './contractValidation';
import { validateInvoiceData } from './invoiceValidation';
import { validateWithZod } from '@/lib/validation';

// Import types from centralized location
import {
  ValidationError,
  ValidationResult,
  ValidationOptions,
  ImportOptions
} from '@/lib/types';

// Export all validation functions
export {
  validateClientData,
  validateSiteData,
  validateContractorData,
  validateContractData,
  validateInvoiceData,
  validateWithZod
};

// Re-export types for convenience
export type {
  ValidationError,
  ValidationResult,
  ValidationOptions,
  ImportOptions
};

// Validation function map for dynamic validation
export const validators = {
  clients: validateClientData,
  sites: validateSiteData,
  contractors: validateContractorData,
  contracts: validateContractData,
  invoices: validateInvoiceData
};
