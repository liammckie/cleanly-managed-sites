
import { supabase } from '../supabase';
import { ClientRecord } from '../types';
import { validateClientData } from './validation/clientValidation';
import { checkExistingItems } from './validation/commonValidation';

// Import clients
export const importClients = async (clients: Partial<ClientRecord>[]): Promise<void> => {
  // Validate client data
  const { isValid, errors, data: validData } = validateClientData(clients);
  
  if (!isValid) {
    console.error('Invalid client data:', errors);
    throw new Error(`Invalid client data. Please check your import file. ${errors.map(e => e.message).join(', ')}`);
  }
  
  // Check for existing clients by ID to avoid duplicates
  const clientsWithIds = validData.filter(client => client.id);
  const existingIds = await checkExistingItems('clients', clientsWithIds.map(client => client.id as string));
  
  const clientsToInsert = validData.filter(client => !client.id || !existingIds.includes(client.id));
  const clientsToUpdate = validData.filter(client => client.id && existingIds.includes(client.id));
  
  // Insert new clients
  if (clientsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('clients')
      .insert(clientsToInsert);
    
    if (insertError) {
      console.error('Error inserting clients:', insertError);
      throw new Error(`Failed to import clients: ${insertError.message}`);
    }
  }
  
  // Update existing clients
  for (const client of clientsToUpdate) {
    const { error: updateError } = await supabase
      .from('clients')
      .update(client)
      .eq('id', client.id);
    
    if (updateError) {
      console.error(`Error updating client ${client.id}:`, updateError);
    }
  }
};
