
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/utils/auth';
import { ClientImportItem, ImportResult, ValidationResult } from './types';
import { validateClients } from './validation/clientValidation';

/**
 * Process client import from validated data
 */
export async function processClientImport(clientsData: any[]): Promise<ImportResult> {
  try {
    // First validate the data
    const validationResult = await validateClients(clientsData);
    
    if (!validationResult.valid || !validationResult.data) {
      const errorMessages = validationResult.errors?.map(err => err.message) || ['Validation failed'];
      return {
        success: false,
        message: 'Validation errors: ' + errorMessages.join(', '),
        count: 0
      };
    }
    
    // Cast to the right type - this is safe because we validated the data
    const validatedData = validationResult.data as unknown as ClientImportItem[];
    
    // Get user ID for proper ownership of records
    const user = await getCurrentUser();
    const userId = user?.id;
    
    if (!userId) {
      return {
        success: false,
        message: 'User not authenticated',
        count: 0
      };
    }
    
    // Prepare clients for insert
    const clientsToInsert = validatedData.map(client => ({
      ...client,
      user_id: userId,
      status: client.status || 'active'
    }));
    
    // Insert clients
    const { data, error } = await supabase
      .from('clients')
      .insert(clientsToInsert);
    
    if (error) {
      console.error('Error inserting clients:', error);
      return {
        success: false,
        message: `Error importing clients: ${error.message}`,
        count: 0
      };
    }
    
    // Return success result
    return {
      success: true,
      message: `Successfully imported ${clientsToInsert.length} clients`,
      count: clientsToInsert.length,
      data: data
    };
  } catch (error) {
    console.error('Error in processClientImport:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      count: 0
    };
  }
}
