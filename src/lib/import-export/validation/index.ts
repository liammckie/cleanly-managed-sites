
// Export validation functions
export { validateClientData } from './clientValidation';
export { validateSiteData } from './siteValidation';
export { validateContractData } from './contractValidation';
export { validateContractorData } from './contractorValidation';
export { validateInvoiceData } from './invoiceValidation';

// Export common validation helpers
export {
  isValidEmail,
  isValidDateFormat,
  validateRequiredFields,
  validateWithZod,
  recordExistsByField,
  recordsExistByField,
  simplifyValidationErrors,
  validateGenericData
} from './commonValidation';

// Export types
export type { ValidationError, ValidationResult } from './commonValidation';
