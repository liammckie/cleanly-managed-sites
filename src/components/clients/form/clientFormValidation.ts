
import { ClientFormData } from './types';

export const validateClientForm = (formData: ClientFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!formData.name.trim()) {
    errors.name = 'Client name is required';
  }
  
  if (!formData.contact_name.trim()) {
    errors.contact_name = 'Contact name is required';
  }
  
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Valid email is required';
  }
  
  return errors;
};
