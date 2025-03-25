export * from './contactTypes';
export * from './periodicalTypes';
export * from './jobSpecificationTypes';
export * from './replenishableTypes';
export * from './securityTypes';
export * from './contractTypes';
export * from './billingTypes';
export * from './adHocWorkTypes';
export * from './siteFormData';
export * from './initialFormData';
// Remove formValidation export to avoid duplicate with validationUtils
// export * from './formValidation';
// Export validationUtils last to avoid conflicts
export * from './validationUtils';

// Update SiteStatus to include "on-hold"
export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold';
