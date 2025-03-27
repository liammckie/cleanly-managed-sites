
import { useState } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { validateWithZod } from '@/lib/validation';
import { siteFormSchema } from '@/lib/validation/siteSchema';

export function useSiteFormValidation() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: SiteFormData): boolean => {
    // Reset validation errors
    setValidationErrors({});
    
    // Validate with Zod schema
    const result = validateWithZod(siteFormSchema, formData);
    
    if (!result.success && result.errors) {
      setValidationErrors(result.errors);
      return false;
    }
    
    return true;
  };

  return {
    validationErrors,
    setValidationErrors,
    validateForm
  };
}
