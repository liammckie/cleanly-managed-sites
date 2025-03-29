
import { z } from 'zod';
import { isValidEmail } from './commonValidation';
import { simplifyValidationErrors, validateRequiredFields, ValidationError } from './commonValidation';

// Schema for client validation
const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email format").optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postcode: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive', 'pending', 'prospect']).optional(),
  notes: z.string().optional().nullable()
});

/**
 * Validate client data
 */
export function validateClientData(clients: any[]) {
  const errors: ValidationError[] = [];
  const validClients: any[] = [];
  
  clients.forEach((client, index) => {
    // Required fields check
    const requiredFields = ['name', 'contact_name'];
    const requiredErrors = validateRequiredFields(client, requiredFields);
    
    Object.entries(requiredErrors).forEach(([field, message]) => {
      errors.push({
        field: `${index}.${field}`,
        message
      });
    });
    
    // Email validation if present
    if (client.email && !isValidEmail(client.email)) {
      errors.push({
        field: `${index}.email`,
        message: 'Invalid email format'
      });
    }
    
    // Schema validation
    const result = clientSchema.safeParse(client);
    if (!result.success) {
      const schemaErrors = simplifyValidationErrors(result.error);
      Object.entries(schemaErrors).forEach(([field, message]) => {
        errors.push({
          field: `${index}.${field}`,
          message
        });
      });
    } else {
      validClients.push(client);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    validClients
  };
}
