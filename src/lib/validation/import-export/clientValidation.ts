
/**
 * Client validation for import/export operations
 */
import { z } from 'zod';
import { ValidationError, ValidationResult, ValidationOptions } from '@/lib/types/validationTypes';
import { ClientImportItem } from '@/lib/types/importExport';
import { formatZodErrors, createValidationResult } from '../core/validationCore';
import { checkForDuplicates } from './validationUtils';

// Zod schema for client validation
const clientImportSchema = z.object({
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
): Promise<ValidationResult & { validClients?: ClientImportItem[] }> {
  const result = createValidationResult();
  const validClients: ClientImportItem[] = [];
  
  for (let i = 0; i < clients.length; i++) {
    const client = clients[i];
    
    // Basic schema validation
    const parseResult = clientImportSchema.safeParse(client);
    
    if (!parseResult.success) {
      // Convert Zod errors to our format and add to result
      const zodErrors = formatZodErrors(parseResult.error);
      zodErrors.forEach(error => {
        result.errors.push({
          field: `clients[${i}].${error.field}`,
          message: error.message,
          row: i
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
          message: `A client with the name "${client.name}" already exists`,
          row: i
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

/**
 * Legacy function name for backward compatibility
 */
export const validateClients = validateClientData;
