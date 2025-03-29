
/**
 * Client validation for import operations
 */
import { z } from 'zod';
import { formatZodErrors, checkForDuplicates, createValidationResult } from './commonValidation';
import { ValidationError, ValidationResult, ValidationOptions, ClientImportItem } from '@/lib/types';

// Zod schema for client validation
export const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  contact_name: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  status: z.enum(['active', 'pending', 'inactive', 'prospect']).optional(),
  notes: z.string().optional(),
  custom_id: z.string().optional()
});

/**
 * Validate client data for import
 */
export async function validateClientData(
  clients: ClientImportItem[],
  options: ValidationOptions = {}
): Promise<ValidationResult & { validClients: ClientImportItem[] }> {
  const result = createValidationResult();
  const validClients: ClientImportItem[] = [];
  
  for (let i = 0; i < clients.length; i++) {
    const client = clients[i];
    
    // Basic schema validation
    const parseResult = clientSchema.safeParse(client);
    
    if (!parseResult.success) {
      // Convert Zod errors to our format and add to result
      const zodErrors = formatZodErrors(parseResult.error);
      zodErrors.forEach(error => {
        result.errors.push({
          field: `clients[${i}].${error.field}`,
          message: error.message
        });
      });
      result.valid = false;
      continue;
    }
    
    // Check for duplicates if needed
    if (options.checkDuplicates && client.name) {
      const isDuplicate = await checkForDuplicates('clients', 'name', client.name, 'id', client.id);
      if (isDuplicate) {
        result.errors.push({
          field: `clients[${i}].name`,
          message: `A client with the name "${client.name}" already exists`
        });
        result.valid = false;
        continue;
      }
    }
    
    // Add to valid clients if passes all checks
    validClients.push(client);
  }
  
  return { ...result, validClients };
}
