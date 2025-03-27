
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteRecord } from '@/lib/types';
import { useSiteFormState } from './useSiteFormState';
import { useBillingLines } from './useBillingLines';
import { useSiteFormValidation } from './useSiteFormValidation';
import { useSiteFormSubmission } from './useSiteFormSubmission';

export function useSiteForm(mode: 'create' | 'edit', initialData?: SiteRecord) {
  // Form state management
  const {
    formData,
    setFormData,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange
  } = useSiteFormState(mode, initialData);
  
  // Validation management
  const {
    validationErrors,
    validateForm
  } = useSiteFormValidation();
  
  // Billing lines management
  const {
    addBillingLine,
    updateBillingLine,
    removeBillingLine
  } = useBillingLines(formData, setFormData);
  
  // Form submission
  const {
    errors,
    isSubmitting,
    handleSubmit
  } = useSiteFormSubmission(mode, formData, validateForm, initialData);

  return {
    // Form data and handlers
    formData,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    
    // Validation
    validationErrors,
    
    // Billing lines
    addBillingLine,
    updateBillingLine,
    removeBillingLine,
    
    // Submission
    errors,
    isSubmitting,
    handleSubmit
  };
}
