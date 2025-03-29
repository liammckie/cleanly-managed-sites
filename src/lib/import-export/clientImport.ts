
import { supabase } from '@/lib/supabase';
import { validateClientImport } from './validation/clientValidation';
import { ValidationResult } from './types';

export interface ClientImportItem {
  name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status?: string;
  notes?: string;
}

export async function processClientImport(clients: ClientImportItem[]) {
  try {
    if (!clients.length) {
      return { success: false, message: 'No clients to import', count: 0 };
    }

    // Validate the clients
    const validationResult: ValidationResult<ClientImportItem> = validateClientImport(clients);
    if (!validationResult.success) {
      return { 
        success: false, 
        message: 'Validation failed', 
        errors: validationResult.errors,
        count: 0 
      };
    }

    // Get the current user
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    // Insert the clients with the user ID
    const { data, error } = await supabase
      .from('clients')
      .insert(clients.map(client => ({
        ...client,
        user_id: userId
      })))
      .select();

    if (error) {
      console.error('Error importing clients:', error);
      throw error;
    }

    return { 
      success: true, 
      message: `Successfully imported ${clients.length} clients`, 
      count: clients.length,
      data
    };
  } catch (error) {
    console.error('Client import failed:', error);
    return { 
      success: false, 
      message: `Client import failed: ${error instanceof Error ? error.message : String(error)}`, 
      count: 0 
    };
  }
}
