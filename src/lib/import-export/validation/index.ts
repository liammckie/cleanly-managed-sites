
/**
 * Export all validation functions from the validation module
 */

export { validateClientData } from './clientValidation';
export { validateSiteData } from './siteValidation';
export { validateContractorData } from './contractorValidation';
export { validateContractData } from './contractValidation';
export { validateInvoiceData } from './invoiceValidation';
export { validateGenericData, validateEmail, validateDateFormat } from './commonValidation';

export type {
  ValidationError,
  ValidationMessage,
  ValidationResult,
  ValidationOptions,
  LegacyValidationResult,
  ZodValidationResult
} from './types';

export {
  legacyToNewValidationResult,
  newToLegacyValidationResult
} from './types';

// Export validation modules for explicit imports
export const validation = {
  client: { validateClientData },
  site: { validateSiteData },
  contractor: { validateContractorData },
  contract: { validateContractData },
  invoice: { validateInvoiceData },
  common: { validateGenericData, validateEmail, validateDateFormat }
};
