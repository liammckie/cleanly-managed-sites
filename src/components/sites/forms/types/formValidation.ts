
import { SiteFormData } from './siteFormData';

// Renamed to avoid conflict with validationUtils.ts
export interface FormValidationErrors {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  representative?: string;
  clientId?: string;
  customId?: string; // Add validation for custom ID
}

// Renamed to avoid conflict with validationUtils.ts
export function validateFormBasicInfo(formData: SiteFormData): FormValidationErrors {
  const errors: FormValidationErrors = {};
  
  if (!formData.name?.trim()) errors.name = 'Site name is required';
  if (!formData.address?.trim()) errors.address = 'Address is required';
  if (!formData.city?.trim()) errors.city = 'City is required';
  if (!formData.state?.trim()) errors.state = 'State is required';
  if (!formData.postcode?.trim()) errors.postcode = 'Postcode is required';
  if (!formData.representative?.trim()) errors.representative = 'Representative name is required';
  if (!formData.clientId) errors.clientId = 'Client is required';
  
  return errors;
}
