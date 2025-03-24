
// This file is maintained for backward compatibility
// It re-exports everything from the types directory
import { 
  SiteFormData, 
} from './types/siteFormData';
import { getInitialFormData } from './types/initialFormData';
import { SiteFormValidationErrors } from './types/formValidation';
import { BillingContact } from './types/contactTypes';

// Export types for backward compatibility
export type { SiteFormData, SiteFormValidationErrors, BillingContact };

// Export functions for backward compatibility
export { getInitialFormData };
