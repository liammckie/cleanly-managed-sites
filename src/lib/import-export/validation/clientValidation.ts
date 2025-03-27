
import { ValidationResult, ValidationMessage } from './types';

/**
 * Validates client data for importing
 * @param clientData The client data to validate
 * @returns Validation result with success flag and error messages
 */
export function validateClientData(clientData: any[]): ValidationResult {
  const messages: ValidationMessage[] = [];
  let isValid = true;
  
  if (!Array.isArray(clientData)) {
    messages.push({
      type: 'error',
      field: 'data',
      message: 'Client data must be an array'
    });
    return { valid: false, messages };
  }
  
  clientData.forEach((client, index) => {
    // Required fields
    if (!client.name) {
      messages.push({
        type: 'error',
        field: 'name',
        message: `Row ${index + 1}: Client name is required`,
        row: index
      });
      isValid = false;
    }
    
    if (!client.contact_name) {
      messages.push({
        type: 'error',
        field: 'contact_name',
        message: `Row ${index + 1}: Contact name is required`,
        row: index
      });
      isValid = false;
    }
    
    // Email validation
    if (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
      messages.push({
        type: 'error',
        field: 'email',
        message: `Row ${index + 1}: Invalid email format`,
        row: index,
        value: client.email
      });
      isValid = false;
    }
    
    // Status validation
    if (client.status && !['active', 'inactive', 'pending'].includes(client.status)) {
      messages.push({
        type: 'warning',
        field: 'status',
        message: `Row ${index + 1}: Invalid status '${client.status}', will default to 'active'`,
        row: index,
        value: client.status
      });
    }
    
    // Phone format warning
    if (client.phone && !/^\+?[0-9\s()-]{8,}$/.test(client.phone)) {
      messages.push({
        type: 'warning',
        field: 'phone',
        message: `Row ${index + 1}: Phone number format may be invalid`,
        row: index,
        value: client.phone
      });
    }
  });
  
  return { valid: isValid, messages };
}
