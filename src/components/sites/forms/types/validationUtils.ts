
import { SiteFormData } from './siteFormData';

export interface FormValidationErrors {
  [key: string]: string;
}

// Validated fields in the basic info step
export function validateBasicInfo(formData: SiteFormData): FormValidationErrors {
  const errors: FormValidationErrors = {};
  
  if (!formData.name) {
    errors.name = 'Site name is required';
  }
  
  if (!formData.client_id) {
    errors.client_id = 'Client is required';
  }
  
  if (!formData.address) {
    errors.address = 'Address is required';
  }
  
  if (!formData.city) {
    errors.city = 'City is required';
  }
  
  if (!formData.state) {
    errors.state = 'State is required';
  }
  
  if (!formData.postalCode) {
    errors.postalCode = 'Postal code is required';
  }
  
  if (!formData.country) {
    errors.country = 'Country is required';
  }
  
  return errors;
}

// Validate contacts
export function validateContacts(formData: SiteFormData): FormValidationErrors {
  const errors: FormValidationErrors = {};
  
  if (!formData.contacts || formData.contacts.length === 0) {
    errors['contacts'] = 'At least one contact is required';
    return errors;
  }
  
  formData.contacts.forEach((contact, index) => {
    if (!contact.name) {
      errors[`contacts[${index}].name`] = 'Contact name is required';
    }
    
    if (contact.email && !isValidEmail(contact.email)) {
      errors[`contacts[${index}].email`] = 'Invalid email format';
    }
  });
  
  return errors;
}

// Validate contract details
export function validateContractDetails(formData: SiteFormData): FormValidationErrors {
  const errors: FormValidationErrors = {};
  
  if (!formData.contract_details?.startDate) {
    errors['contract_details.startDate'] = 'Start date is required';
  }
  
  if (!formData.contract_details?.endDate) {
    errors['contract_details.endDate'] = 'End date is required';
  }
  
  return errors;
}

// Validate entire form
export function validateSiteForm(formData: SiteFormData): FormValidationErrors {
  let errors: FormValidationErrors = {};
  
  errors = {
    ...validateBasicInfo(formData),
    ...validateContacts(formData),
    ...validateContractDetails(formData)
  };
  
  return errors;
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
