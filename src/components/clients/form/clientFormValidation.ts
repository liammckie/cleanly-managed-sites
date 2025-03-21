
import { ClientFormData } from './types';

export const validateClientForm = (formData: ClientFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Validate required fields
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Client name is required';
  }
  
  if (!formData.contact_name || !formData.contact_name.trim()) {
    errors.contact_name = 'Contact name is required';
  }
  
  // Validate email format if provided
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = 'Valid email is required';
  }
  
  // Validate phone format if provided
  if (formData.phone && !/^[+]?[\d\s()-]{7,}$/.test(formData.phone.trim())) {
    errors.phone = 'Valid phone number is required';
  }
  
  return errors;
};
