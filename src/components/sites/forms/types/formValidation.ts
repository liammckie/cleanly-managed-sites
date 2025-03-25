
import { SiteFormData } from './siteFormData';

// Renamed to avoid conflict with validationUtils.ts
export interface FormValidationErrors {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string; // Changed from postcode
  representative?: string;
  client_id?: string;  // Changed from clientId
  customId?: string; 
}

// Renamed to avoid conflict with validationUtils.ts
export function validateFormBasicInfo(formData: SiteFormData): FormValidationErrors {
  const errors: FormValidationErrors = {};
  
  if (!formData.name?.trim()) errors.name = 'Site name is required';
  if (!formData.address?.trim()) errors.address = 'Address is required';
  if (!formData.city?.trim()) errors.city = 'City is required';
  if (!formData.state?.trim()) errors.state = 'State is required';
  if (!formData.postalCode?.trim()) errors.postalCode = 'Postal code is required'; // Changed from postcode
  if (!formData.representative?.trim()) errors.representative = 'Representative name is required';
  if (!formData.client_id) errors.client_id = 'Client is required'; // Changed from clientId
  
  return errors;
}
