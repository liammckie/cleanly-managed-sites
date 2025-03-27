
import { EnhancedValidationResult, ValidationMessage } from '@/types/common';
import { isValidEmail, isValidPhone } from '@/utils/validationUtils';

export function validateClientData(clients: any[]): EnhancedValidationResult {
  const errors: ValidationMessage[] = [];
  
  clients.forEach((client, index) => {
    // Validate required fields
    if (!client.name) {
      errors.push({
        field: 'name',
        message: 'Client name is required',
        row: index
      });
    }
    
    // Validate email format if provided
    if (client.email && !isValidEmail(client.email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
        row: index
      });
    }
    
    // Validate phone number format if provided
    if (client.phone && !isValidPhone(client.phone)) {
      errors.push({
        field: 'phone',
        message: 'Invalid phone number format',
        row: index
      });
    }
    
    // Additional validations as needed...
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    data: clients,
    warnings: []
  };
}
