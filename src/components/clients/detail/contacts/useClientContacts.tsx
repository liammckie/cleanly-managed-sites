
import { useState, useEffect } from 'react';
import { ContactRecord } from '@/lib/types';
import { contactsApi } from '@/lib/api';
import { toast } from 'sonner';

export function useClientContacts(clientId: string) {
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const clientContacts = await contactsApi.getContactsByEntityId(clientId, 'client');
        setContacts(clientContacts);
      } catch (err: any) {
        setError(err.message || 'Failed to load contacts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [clientId, refreshKey]);

  const handleContactSubmit = async (data: Partial<ContactRecord>): Promise<void> => {
    try {
      if (data.id) {
        await contactsApi.updateContact(data.id, data);
      } else {
        await contactsApi.createContact({ ...data, entity_id: clientId, entity_type: 'client' } as Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>);
      }
      
      toast.success('Contact saved successfully');
      refreshContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact');
      throw error;
    }
  };

  const refreshContacts = () => {
    setRefreshKey(prev => prev + 1);
  };

  return {
    contacts,
    isLoading,
    error,
    handleContactSubmit,
    refreshContacts
  };
}
