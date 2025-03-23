
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '@/lib/api';
import { ContactRecord } from '@/lib/types';
import { toast } from 'sonner';

export function useContacts() {
  const queryClient = useQueryClient();
  const [activeEntityType, setActiveEntityType] = useState<string | undefined>(undefined);
  
  // Fetch all contacts
  const { 
    data: contacts = [], 
    isLoading, 
    error,
  } = useQuery({
    queryKey: ['contacts', activeEntityType],
    queryFn: () => contactsApi.getContacts(activeEntityType),
  });

  // Add contact mutation
  const addContactMutation = useMutation({
    mutationFn: (contactData: Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>) => 
      contactsApi.createContact(contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact added successfully');
    },
    onError: (error: any) => {
      console.error('Error adding contact:', error);
      toast.error(`Failed to add contact: ${error.message}`);
    }
  });

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContactRecord> }) => 
      contactsApi.updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating contact:', error);
      toast.error(`Failed to update contact: ${error.message}`);
    }
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => contactsApi.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting contact:', error);
      toast.error(`Failed to delete contact: ${error.message}`);
    }
  });
  
  // Set primary contact mutation
  const setPrimaryContactMutation = useMutation({
    mutationFn: ({ id, entityId, entityType }: { id: string; entityId: string; entityType: string }) => 
      contactsApi.setPrimaryContact(id, entityId, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Primary contact updated');
    },
    onError: (error: any) => {
      console.error('Error setting primary contact:', error);
      toast.error(`Failed to set primary contact: ${error.message}`);
    }
  });

  // Fetch contacts for a specific entity
  const fetchContactsForEntity = async (entityId: string, entityType: 'client' | 'site') => {
    try {
      const entityContacts = await contactsApi.getContactsByEntityId(entityId, entityType);
      return entityContacts;
    } catch (error) {
      console.error(`Error fetching contacts for ${entityType} ${entityId}:`, error);
      toast.error(`Failed to load contacts for this ${entityType}`);
      throw error;
    }
  };

  return {
    contacts,
    isLoading: isLoading || addContactMutation.isPending || updateContactMutation.isPending || deleteContactMutation.isPending,
    error,
    isCreating: addContactMutation.isPending,
    isUpdating: updateContactMutation.isPending,
    isDeleting: deleteContactMutation.isPending,
    filter: activeEntityType,
    setFilter: setActiveEntityType,
    fetchContactsForEntity,
    addContact: (contact: Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>) => 
      addContactMutation.mutateAsync(contact),
    updateContact: (id: string, contact: Partial<ContactRecord>) => 
      updateContactMutation.mutateAsync({ id, data: contact }),
    deleteContact: (id: string) => deleteContactMutation.mutateAsync(id),
    setPrimaryContact: (id: string, entityId: string, entityType: string) => 
      setPrimaryContactMutation.mutateAsync({ id, entityId, entityType }),
    createContact: (contact: Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>) => 
      addContactMutation.mutateAsync(contact)
  };
}

export function useEntityContacts(entityId?: string, entityType?: 'client' | 'site') {
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['entity-contacts', entityType, entityId],
    queryFn: () => 
      entityId && entityType 
        ? contactsApi.getContactsByEntityId(entityId, entityType)
        : Promise.resolve([]),
    enabled: !!entityId && !!entityType,
  });
  
  return {
    contacts,
    isLoading,
    error
  };
}
