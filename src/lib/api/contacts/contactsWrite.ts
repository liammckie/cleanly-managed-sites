
import { supabase } from '@/lib/supabase';
import { ContactRecord } from '@/lib/types';

export const contactsWrite = {
  async createContact(contactData: Partial<ContactRecord>): Promise<ContactRecord> {
    if (!contactData.entity_id || !contactData.entity_type || !contactData.name) {
      throw new Error('Required contact fields missing: entity_id, entity_type, and name are required');
    }
    
    // Create data object with all necessary fields
    const data = {
      entity_id: contactData.entity_id,
      entity_type: contactData.entity_type,
      name: contactData.name,
      role: contactData.role || '',
      email: contactData.email || null,
      phone: contactData.phone || null,
      department: contactData.department || null,
      notes: contactData.notes || null,
      is_primary: contactData.is_primary || false,
      monthly_cost: contactData.monthly_cost || null,
      is_flat_rate: contactData.is_flat_rate || true,
      services: contactData.services || null,
      user_id: contactData.user_id || null
    };
    
    const { data: newContact, error } = await supabase
      .from('contacts')
      .insert(data)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
    
    return newContact as ContactRecord;
  },
  
  async updateContact({ id, data }: { id: string; data: Partial<ContactRecord> }): Promise<ContactRecord> {
    if (!id) {
      throw new Error('Contact ID is required for update');
    }
    
    const { data: updatedContact, error } = await supabase
      .from('contacts')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating contact with ID ${id}:`, error);
      throw error;
    }
    
    return updatedContact as ContactRecord;
  },
  
  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting contact with ID ${id}:`, error);
      throw error;
    }
  }
};
