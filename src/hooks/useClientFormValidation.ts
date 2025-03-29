
import { useState } from 'react';
import { validateWithZod } from '@/lib/validation';
import { clientFormSchema } from '@/lib/validation/schemas';

/**
 * Custom hook for client form validation
 */
export function useClientFormValidation() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: any): { isValid: boolean; data?: any } => {
    // Reset validation errors
    setValidationErrors({});
    
    // Validate with Zod schema
    const result = validateWithZod(clientFormSchema, formData);
    
    if (!result.success && result.errors) {
      setValidationErrors(result.errors);
      return { isValid: false };
    }
    
    return { isValid: true, data: result.data };
  };

  const clearErrors = () => {
    setValidationErrors({});
  };

  const setFieldError = (field: string, message: string) => {
    setValidationErrors(prev => ({
      ...prev,
      [field]: message
    }));
  };

  const clearFieldError = (field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    validationErrors,
    validateForm,
    clearErrors,
    setFieldError,
    clearFieldError,
    hasErrors: Object.keys(validationErrors).length > 0
  };
}
