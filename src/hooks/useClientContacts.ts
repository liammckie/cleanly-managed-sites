
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContactRecord } from '@/lib/types';
import { clientsApi } from '@/lib/api';
import { toast } from 'sonner';

export function useClientContacts(clientId: string | undefined) {
  const queryClient = useQueryClient();
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  
  // Query for fetching a specific client's contacts
  const contactsQuery = useQuery({
    queryKey: ['clientContacts', clientId],
    queryFn: () => clientId ? clientsApi.getClientContacts(clientId) : Promise.resolve([]),
    enabled: !!clientId,
  });
  
  // Mutation for adding a new contact
  const addContactMutation = useMutation({
    mutationFn: (contactData: Partial<ContactRecord>) => 
      clientId ? clientsApi.addClientContact(clientId, contactData) : Promise.reject('No client ID provided'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientContacts', clientId] });
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      toast.success('Contact added successfully');
    },
    onError: (error: any) => {
      console.error('Error adding contact:', error);
      toast.error(`Failed to add contact: ${error.message}`);
    },
  });
  
  // Mutation for updating a contact
  const updateContactMutation = useMutation({
    mutationFn: (data: { id: string; contactData: Partial<ContactRecord> }) => 
      clientsApi.updateClientContact(data.id, data.contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientContacts', clientId] });
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      toast.success('Contact updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating contact:', error);
      toast.error(`Failed to update contact: ${error.message}`);
    },
  });
  
  // Mutation for deleting a contact
  const deleteContactMutation = useMutation({
    mutationFn: (contactId: string) => clientsApi.deleteClientContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientContacts', clientId] });
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      toast.success('Contact deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting contact:', error);
      toast.error(`Failed to delete contact: ${error.message}`);
    },
  });
  
  // Set a contact as primary
  const setPrimaryContactMutation = useMutation({
    mutationFn: async (contactId: string) => {
      // First, get all contacts for this client
      const contacts = await clientsApi.getClientContacts(clientId!);
      
      // Update all contacts to not be primary
      for (const contact of contacts) {
        if (contact.is_primary) {
          await clientsApi.updateClientContact(contact.id, { is_primary: false });
        }
      }
      
      // Set the selected contact as primary
      return clientsApi.updateClientContact(contactId, { is_primary: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientContacts', clientId] });
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      toast.success('Primary contact updated');
    },
    onError: (error: any) => {
      console.error('Error setting primary contact:', error);
      toast.error(`Failed to set primary contact: ${error.message}`);
    },
  });
  
  return {
    contacts: contactsQuery.data || [],
    isLoading: contactsQuery.isLoading,
    isError: contactsQuery.isError,
    error: contactsQuery.error,
    selectedContact,
    setSelectedContact,
    addContact: addContactMutation.mutate,
    updateContact: updateContactMutation.mutate, 
    deleteContact: deleteContactMutation.mutate,
    setPrimaryContact: setPrimaryContactMutation.mutate,
    isAdding: addContactMutation.isPending,
    isUpdating: updateContactMutation.isPending,
    isDeleting: deleteContactMutation.isPending,
  };
}
