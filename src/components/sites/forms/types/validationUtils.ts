
import { SiteFormData } from './siteFormData';

export interface FormValidationErrors {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  clientId?: string;
  status?: string;
  [key: string]: string | undefined;
}

// Alias for backward compatibility
export type SiteFormValidationErrors = FormValidationErrors;

export function validateBasicInfo(formData: Partial<SiteFormData>): FormValidationErrors {
  const errors: FormValidationErrors = {};

  if (!formData.name?.trim()) {
    errors.name = 'Site name is required';
  }

  if (!formData.address?.trim()) {
    errors.address = 'Address is required';
  }

  if (!formData.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!formData.state?.trim()) {
    errors.state = 'State is required';
  }

  if (!formData.postalCode?.trim()) {
    errors.postalCode = 'Postal code is required';
  }

  if (!formData.client_id) {
    errors.clientId = 'Client is required';
  }

  return errors;
}
