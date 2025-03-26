
// This file is maintained for backward compatibility
// It re-exports everything from the types directory
import { 
  SiteFormData,
  siteStatusOptions
} from './siteFormData';
import { getInitialFormData } from './initialFormData';
import { SiteFormValidationErrors } from './validationUtils';
import { BillingContact } from './contactTypes';

// Export types for backward compatibility
export type { SiteFormData, SiteFormValidationErrors, BillingContact };

// Export functions for backward compatibility
export { getInitialFormData, siteStatusOptions };
