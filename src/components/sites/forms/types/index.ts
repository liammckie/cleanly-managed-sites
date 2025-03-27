
// Re-export all form types for easier imports
export * from './siteFormData';

// Export contract types
export type { ContractDetails } from './contractTypes';
export type { Subcontractor } from './subcontractorTypes';
export type { Periodicals } from './periodicalTypes';
export type { ReplenishableItem } from './replenishableTypes';
export type { SecurityDetails } from './securityTypes';
export type { FormValidationErrors as SiteFormValidationErrors } from './formValidation';
export * from './initialFormData';
export type { SiteFormHandlers } from './siteFormHandlers';

// Export billing types with proper 'export type' syntax
export type { 
  BillingFrequency
} from './billingTypes';

// Explicitly export with renamed type to resolve ambiguity
export type { BillingAmounts as BillingAmountTotals } from './billingTypes';
export type { BillingLine, BillingDetails } from './billingTypes';

// Fix ambiguity by explicitly re-exporting as types
export type { BillingContact } from './billingTypes';
export type { AdHocWorkAuthorization } from './adHocWorkTypes';
export type { JobSpecifications } from './jobSpecificationTypes';
