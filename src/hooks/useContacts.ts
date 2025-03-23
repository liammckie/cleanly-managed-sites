
import { useState } from 'react';
import { ContactRecord } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

export const useContacts = () => {
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all contacts for an entity (client or site)
  const fetchContactsForEntity = async (entityId: string, entityType: 'client' | 'site') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('entity_id', entityId)
        .eq('entity_type', entityType)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching contacts: ${error.message}`);
      }
      
      setContacts(data as ContactRecord[]);
    } catch (err) {
      console.error('Error in fetchContactsForEntity:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch contacts'));
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new contact
  const addContact = async (contact: {
    name: string;
    role: string;
    entity_id: string;
    entity_type: 'site' | 'client';
    email?: string;
    phone?: string;
    department?: string;
    is_primary?: boolean;
    notes?: string;
    user_id?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert(contact)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error creating contact: ${error.message}`);
      }
      
      setContacts(prev => [...prev, data as ContactRecord]);
      return data as ContactRecord;
    } catch (err) {
      console.error('Error in addContact:', err);
      setError(err instanceof Error ? err : new Error('Failed to add contact'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing contact
  const updateContact = async (id: string, contact: Partial<ContactRecord>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(contact)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error updating contact: ${error.message}`);
      }
      
      setContacts(prev => prev.map(c => c.id === id ? (data as ContactRecord) : c));
      return data as ContactRecord;
    } catch (err) {
      console.error('Error in updateContact:', err);
      setError(err instanceof Error ? err : new Error('Failed to update contact'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a contact
  const deleteContact = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Error deleting contact: ${error.message}`);
      }
      
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error in deleteContact:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete contact'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contacts,
    isLoading,
    error,
    fetchContactsForEntity,
    addContact,
    updateContact,
    deleteContact
  };
};
