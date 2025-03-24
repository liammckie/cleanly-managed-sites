
import { supabase } from '@/lib/supabase';
import { ContactRecord } from '@/lib/types';

// Create a new contact
export async function addContact(contactData: ContactRecord) {
  // Make sure required fields are present
  if (!contactData.name || !contactData.role || !contactData.entity_id || !contactData.entity_type) {
    throw new Error('Missing required contact fields');
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert([{
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      role: contactData.role,
      department: contactData.department,
      notes: contactData.notes,
      entity_id: contactData.entity_id,
      entity_type: contactData.entity_type,
      is_primary: contactData.is_primary || false,
      monthly_cost: contactData.monthly_cost,
      is_flat_rate: contactData.is_flat_rate,
      services: contactData.services,
      user_id: contactData.user_id
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating contact:', error);
    throw error;
  }

  return data;
}

// Update an existing contact
export async function updateContactRecord(id: string, contactData: Partial<ContactRecord>) {
  const { data, error } = await supabase
    .from('contacts')
    .update({
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      role: contactData.role,
      department: contactData.department,
      notes: contactData.notes,
      is_primary: contactData.is_primary,
      monthly_cost: contactData.monthly_cost,
      is_flat_rate: contactData.is_flat_rate,
      services: contactData.services
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact:', error);
    throw error;
  }

  return data;
}

// Delete a contact
export async function removeContact(id: string) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }

  return { success: true, id };
}

// Set a contact as primary
export async function makePrimaryContact(contactId: string, entityId: string, entityType: string) {
  // First, set all contacts for this entity to not primary
  const { error: updateError } = await supabase
    .from('contacts')
    .update({ is_primary: false })
    .eq('entity_id', entityId)
    .eq('entity_type', entityType);

  if (updateError) {
    console.error('Error resetting primary contacts:', updateError);
    throw updateError;
  }

  // Then set the selected contact as primary
  const { data, error } = await supabase
    .from('contacts')
    .update({ is_primary: true })
    .eq('id', contactId)
    .select()
    .single();

  if (error) {
    console.error('Error setting primary contact:', error);
    throw error;
  }

  return data;
}
