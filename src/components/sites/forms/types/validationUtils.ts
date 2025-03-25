
import { SiteFormData } from './siteFormData';

export interface SiteFormValidationErrors {
  [key: string]: string;
}

export const validateBasicInfo = (formData: SiteFormData): SiteFormValidationErrors => {
  const errors: SiteFormValidationErrors = {};
  
  if (!formData.name) errors.name = 'Site name is required';
  if (!formData.address) errors.address = 'Address is required';
  if (!formData.city) errors.city = 'City is required';
  if (!formData.state) errors.state = 'State is required';
  if (!formData.postalCode) errors.postalCode = 'Postal code is required'; // Changed from postcode
  if (!formData.client_id) errors.client_id = 'Client is required'; // Changed from clientId
  
  return errors;
};
