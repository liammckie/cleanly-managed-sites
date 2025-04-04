
import { useState } from 'react';
import { validateWithZod } from '@/lib/validation';
import { z } from 'zod';

/**
 * Generic form validation hook that can be used with any Zod schema
 */
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: any): { isValid: boolean; data?: T } => {
    // Reset validation errors
    setValidationErrors({});
    
    // Validate with Zod schema
    const result = validateWithZod<T>(schema, formData);
    
    if (!result.success && result.errors) {
      setValidationErrors(result.errors);
      return { isValid: false };
    }
    
    return { isValid: true, data: result.data as T };
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
