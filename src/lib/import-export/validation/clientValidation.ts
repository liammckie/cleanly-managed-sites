
import { ValidationResult, ValidationMessage, ValidationError } from '../types';
import { ClientImportItem } from '../types';

/**
 * Validates client data for importing
 * @param clientData The client data to validate
 * @returns Validation result with success flag and error messages
 */
export function validateClientData(clientData: any): ValidationResult<ClientImportItem> {
  const messages: ValidationMessage[] = [];
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  let valid = true;
  
  if (!Array.isArray(clientData)) {
    const error = {
      path: 'data',
      message: 'Client data must be an array'
    };
    errors.push(error);
    messages.push({
      type: 'error',
      field: 'data',
      message: 'Client data must be an array'
    });
    return { valid: false, errors, warnings, messages };
  }
  
  const validData: ClientImportItem[] = [];
  
  clientData.forEach((client, index) => {
    const validClient: Partial<ClientImportItem> = {};
    
    // Required fields
    if (!client.name) {
      valid = false;
      const error = {
        path: `[${index}].name`,
        message: `Row ${index + 1}: Client name is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'name',
        message: `Row ${index + 1}: Client name is required`,
        row: index
      });
    } else {
      validClient.name = client.name;
    }
    
    if (!client.contact_name) {
      valid = false;
      const error = {
        path: `[${index}].contact_name`,
        message: `Row ${index + 1}: Contact name is required`
      };
      errors.push(error);
      messages.push({
        type: 'error',
        field: 'contact_name',
        message: `Row ${index + 1}: Contact name is required`,
        row: index
      });
    } else {
      validClient.contact_name = client.contact_name;
    }
    
    // Email validation
    if (client.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
        valid = false;
        const error = {
          path: `[${index}].email`,
          message: `Row ${index + 1}: Invalid email format`
        };
        errors.push(error);
        messages.push({
          type: 'error',
          field: 'email',
          message: `Row ${index + 1}: Invalid email format`,
          row: index,
          value: client.email
        });
      } else {
        validClient.email = client.email;
      }
    }
    
    // Status validation
    if (client.status && !['active', 'inactive', 'pending'].includes(client.status)) {
      const warning = {
        path: `[${index}].status`,
        message: `Row ${index + 1}: Invalid status '${client.status}', will default to 'active'`
      };
      warnings.push(warning);
      messages.push({
        type: 'warning',
        field: 'status',
        message: `Row ${index + 1}: Invalid status '${client.status}', will default to 'active'`,
        row: index,
        value: client.status
      });
      validClient.status = 'active';
    } else {
      validClient.status = client.status || 'active';
    }
    
    // Phone format warning
    if (client.phone && !/^\+?[0-9\s()-]{8,}$/.test(client.phone)) {
      const warning = {
        path: `[${index}].phone`,
        message: `Row ${index + 1}: Phone number format may be invalid`
      };
      warnings.push(warning);
      messages.push({
        type: 'warning',
        field: 'phone',
        message: `Row ${index + 1}: Phone number format may be invalid`,
        row: index,
        value: client.phone
      });
    }
    
    // Copy other optional fields
    validClient.phone = client.phone;
    validClient.address = client.address;
    validClient.city = client.city;
    validClient.state = client.state;
    validClient.postcode = client.postcode;
    validClient.notes = client.notes;
    
    // Add to valid data if all required fields are present
    if (validClient.name && validClient.contact_name) {
      validData.push(validClient as ClientImportItem);
    }
  });
  
  return { valid, data: validData, errors, warnings, messages };
}
