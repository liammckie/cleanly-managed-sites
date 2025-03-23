
import { supabase } from '@/integrations/supabase/client';
import { ContactRecord } from '../types';

// Contacts API functions
export const contactsApi = {
  // Get all contacts for the current user, optionally filtered by entity type
  async getContacts(entityType?: string): Promise<ContactRecord[]> {
    let query = supabase
      .from('contacts')
      .select('*');
    
    if (entityType && entityType !== 'all') {
      query = query.eq('entity_type', entityType);
    }
    
    const { data: contacts, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
    
    return contacts as ContactRecord[] || [];
  },
  
  // Get a single contact by ID
  async getContactById(id: string): Promise<ContactRecord | null> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
    
    return data as ContactRecord;
  },
  
  // Create a new contact
  async createContact(contactData: Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ContactRecord> {
    console.log('Creating contact with data:', contactData);
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Make sure required fields are present
    if (!contactData.name || !contactData.role || !contactData.entity_id || !contactData.entity_type) {
      throw new Error('Missing required contact data: name, role, entity_id, and entity_type are required');
    }
    
    // Prepare the contact data for insertion
    const contactRecord = {
      ...contactData,
      user_id: user.id,
    };
    
    const { data, error } = await supabase
      .from('contacts')
      .insert(contactRecord)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
    
    return data as ContactRecord;
  },
  
  // Update an existing contact
  async updateContact(id: string, contactData: Partial<ContactRecord>): Promise<ContactRecord> {
    const { data, error } = await supabase
      .from('contacts')
      .update(contactData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating contact with ID ${id}:`, error);
      throw error;
    }
    
    return data as ContactRecord;
  },
  
  // Delete a contact
  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting contact with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Get contacts for a specific entity (client, site, etc.)
  async getContactsByEntityId(entityId: string, entityType: string): Promise<ContactRecord[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .order('is_primary', { ascending: false });
    
    if (error) {
      console.error(`Error fetching contacts for entity ${entityId}:`, error);
      throw error;
    }
    
    return data as ContactRecord[] || [];
  },
  
  // Set a contact as primary for its entity
  async setPrimaryContact(id: string, entityId: string, entityType: string): Promise<void> {
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
};
