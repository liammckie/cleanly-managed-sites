
import { 
  SiteFormData, 
} from './types/siteFormData';
import { getInitialFormData } from './types/initialFormData';
import { 
  SiteFormValidationErrors, 
  validateBasicInfo 
} from './types/validationUtils';
import { BillingContact } from './types/contactTypes';

// Export types for backward compatibility
export type { 
  SiteFormData, 
  SiteFormValidationErrors, 
  BillingContact 
};

// Export functions for backward compatibility
export { 
  getInitialFormData, 
  validateBasicInfo 
};
