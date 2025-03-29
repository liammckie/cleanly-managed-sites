
import { SiteFormData } from './siteFormData';

export interface SiteFormValidationErrors {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  contacts?: string;
  contractDetails?: string;
}

export const validateBasicInfo = (formData: SiteFormData): boolean => {
  return !!(formData.name && formData.address && formData.city && formData.state);
};

export const validateContacts = (contacts: any[]): string | null => {
  if (!contacts || contacts.length === 0) {
    return 'At least one contact is required';
  }
  return null;
};

export const validateContractDetails = (contractDetails: any): string | null => {
  // Add specific contract details validation logic
  if (!contractDetails || Object.keys(contractDetails).length === 0) {
    return 'Contract details are required';
  }
  return null;
};

export const validateSiteForm = (formData: SiteFormData): { isValid: boolean; errors: SiteFormValidationErrors } => {
  const errors: SiteFormValidationErrors = {};
  
  if (!formData.name) errors.name = 'Site name is required';
  if (!formData.address) errors.address = 'Address is required';
  if (!formData.city) errors.city = 'City is required';
  if (!formData.state) errors.state = 'State is required';
  
  const contactsError = validateContacts(formData.contacts);
  if (contactsError) errors.contacts = contactsError;
  
  const contractDetailsError = validateContractDetails(formData.contract_details);
  if (contractDetailsError) errors.contractDetails = contractDetailsError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
