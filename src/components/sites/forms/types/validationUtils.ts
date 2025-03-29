import { SiteFormData } from './siteFormData';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateBasicInfo = (formData: SiteFormData): boolean => {
  return !!(formData.name && formData.address && formData.city && formData.state);
};

export const validateSiteForm = (formData: SiteFormData): ValidationResult => {
  const errors: string[] = [];
  
  // Basic information validation
  if (!formData.name) {
    errors.push('Site name is required');
  }
  
  if (!formData.address) {
    errors.push('Address is required');
  }
  
  if (!formData.city) {
    errors.push('City is required');
  }
  
  if (!formData.state) {
    errors.push('State is required');
  }
  
  if (!formData.postalCode && !formData.postcode) {
    errors.push('Postal code is required');
  }
  
  // Add more validation as needed for other sections
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
