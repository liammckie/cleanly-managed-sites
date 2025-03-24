
import { supabase } from '@/integrations/supabase/client';
import { ContactRecord } from '../../types';

export const clientContactsApi = {
  async addClientContact(clientId: string, contactData: Partial<ContactRecord>): Promise<ContactRecord> {
    if (!contactData.name || !contactData.role) {
      throw new Error('Contact name and role are required fields');
    }
    
    const contact = {
      ...contactData,
      name: contactData.name,
      role: contactData.role,
      entity_id: clientId,
      entity_type: 'client',
    };
    
    const { data, error } = await supabase
      .from('contacts')
      .insert(contact)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding contact to client:', error);
      throw error;
    }
    
    return data as ContactRecord;
  },
  
  async updateClientContact(contactId: string, contactData: Partial<ContactRecord>): Promise<ContactRecord> {
    const { data, error } = await supabase
      .from('contacts')
      .update(contactData)
      .eq('id', contactId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating client contact:', error);
      throw error;
    }
    
    return data as ContactRecord;
  },
  
  async deleteClientContact(contactId: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId);
    
    if (error) {
      console.error('Error deleting client contact:', error);
      throw error;
    }
  },
  
  async getClientContacts(clientId: string): Promise<ContactRecord[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('entity_id', clientId)
      .eq('entity_type', 'client');
    
    if (error) {
      console.error('Error fetching client contacts:', error);
      throw error;
    }
    
    return data as ContactRecord[];
  }
};
