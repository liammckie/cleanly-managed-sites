
import { SiteFormData } from './siteFormData';

export interface FormValidationErrors {
  [key: string]: string;
}

/**
 * Validate basic information step
 */
export const validateBasicInfo = (formData: SiteFormData): FormValidationErrors => {
  const errors: FormValidationErrors = {};

  if (!formData.name) {
    errors['name'] = 'Site name is required';
  }

  if (!formData.address) {
    errors['address'] = 'Address is required';
  }

  if (!formData.city) {
    errors['city'] = 'City is required';
  }

  if (!formData.state) {
    errors['state'] = 'State is required';
  }

  if (!formData.postalCode && !formData.postcode) {
    errors['postalCode'] = 'Postal code is required';
  }

  if (!formData.client_id) {
    errors['client_id'] = 'Client is required';
  }

  return errors;
};

/**
 * Validate site contacts
 */
export const validateContacts = (formData: SiteFormData): FormValidationErrors => {
  const errors: FormValidationErrors = {};
  const contacts = formData.contacts || [];

  contacts.forEach((contact, index) => {
    if (!contact.name) {
      errors[`contacts.${index}.name`] = 'Contact name is required';
    }
    
    if (!contact.role) {
      errors[`contacts.${index}.role`] = 'Contact role is required';
    }
  });

  return errors;
};

/**
 * Validate contract details
 */
export const validateContractDetails = (formData: SiteFormData): FormValidationErrors => {
  const errors: FormValidationErrors = {};
  const contractDetails = formData.contract_details || {};

  if (contractDetails.startDate && contractDetails.endDate) {
    try {
      const startDate = new Date(contractDetails.startDate);
      const endDate = new Date(contractDetails.endDate);
      
      if (endDate <= startDate) {
        errors['contract_details.endDate'] = 'End date must be after start date';
      }
    } catch (e) {
      errors['contract_details.dateFormat'] = 'Invalid date format';
    }
  }

  return errors;
};

/**
 * Validate all form data
 */
export const validateSiteForm = (formData: SiteFormData): FormValidationErrors => {
  let errors: FormValidationErrors = {};
  
  // Combine all validation results
  errors = {
    ...validateBasicInfo(formData),
    ...validateContacts(formData),
    ...validateContractDetails(formData)
  };
  
  return errors;
};
