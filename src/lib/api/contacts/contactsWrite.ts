
import { supabase } from '@/integrations/supabase/client';
import { ContactRecord } from '../../types';
import { prepareEntityId } from './contactsCore';

// Create a new contact
export async function createContact(contactData: Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ContactRecord> {
  console.log('Creating contact with data:', contactData);
  
  // Check for user but don't throw if not found - let the DB handle permissions
  const { data: { user } } = await supabase.auth.getUser();
  
  // Make sure required fields are present
  if (!contactData.name || !contactData.role) {
    throw new Error('Missing required contact data: name and role are required');
  }
  
  // Special handling for bulk assignments and internal contacts
  const entity_id = prepareEntityId(contactData.entity_type, contactData.entity_id as string);
  
  // Prepare services field as JSON
  const preparedContactData = {
    ...contactData,
    entity_id,
    user_id: user?.id, // This will be null if no user, but the RLS policies will handle this
    services: contactData.services || null,
    monthly_cost: contactData.monthly_cost || null,
    is_flat_rate: contactData.is_flat_rate !== undefined ? contactData.is_flat_rate : true
  };
  
  const { data, error } = await supabase
    .from('contacts')
    .insert(preparedContactData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
  
  return data as ContactRecord;
}

// Update an existing contact
export async function updateContact(id: string, contactData: Partial<ContactRecord>): Promise<ContactRecord> {
  // Special handling for bulk assignments and internal contacts
  const entity_id = contactData.entity_type ? 
    prepareEntityId(contactData.entity_type, contactData.entity_id as string) : 
    contactData.entity_id;
  
  // Ensure services is properly handled
  const preparedData = {
    ...contactData,
    entity_id,
    services: contactData.services || null,
    monthly_cost: contactData.monthly_cost || null,
    is_flat_rate: contactData.is_flat_rate !== undefined ? contactData.is_flat_rate : true
  };

  const { data, error } = await supabase
    .from('contacts')
    .update(preparedData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating contact with ID ${id}:`, error);
    throw error;
  }
  
  return data as ContactRecord;
}

// Delete a contact
export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting contact with ID ${id}:`, error);
    throw error;
  }
}

// Set a contact as primary for its entity
export async function setPrimaryContact(id: string, entityId: string, entityType: string): Promise<void> {
  // Start a transaction by first unsetting current primary
  const { error: updateError } = await supabase
    .from('contacts')
    .update({ is_primary: false })
    .eq('entity_id', entityId)
    .eq('entity_type', entityType);
  
  if (updateError) {
    console.error('Error unsetting primary contacts:', updateError);
    throw updateError;
  }
  
  // Then set the new primary
  const { error: setPrimaryError } = await supabase
    .from('contacts')
    .update({ is_primary: true })
    .eq('id', id);
  
  if (setPrimaryError) {
    console.error(`Error setting contact ${id} as primary:`, setPrimaryError);
    throw setPrimaryError;
  }
}
