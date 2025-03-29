
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

/**
 * Specialized version for site form validation
 */
export function useSiteFormValidation() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: any): boolean => {
    // Reset validation errors
    setValidationErrors({});
    
    // Get schema from imports
    const { siteFormSchema } = require('@/lib/validation/schemas/siteSchema');
    
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

/**
 * Specialized version for client form validation
 */
export function useClientFormValidation() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: any): boolean => {
    // Reset validation errors
    setValidationErrors({});
    
    // Get schema from imports
    const { clientFormSchema } = require('@/lib/validation/schemas/clientSchema');
    
    // Validate with Zod schema
    const result = validateWithZod(clientFormSchema, formData);
    
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
