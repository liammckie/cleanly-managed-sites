
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contactsApi } from '@/lib/api/contactsApi';
import { ContactRecord } from '@/lib/types';
import { useState } from 'react';

export function useContacts(entityType?: string) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>(entityType || 'all');
  
  // Query for fetching contacts, filtered by entity type if provided
  const contactsQuery = useQuery({
    queryKey: ['contacts', filter],
    queryFn: () => contactsApi.getContacts(filter !== 'all' ? filter : undefined),
  });
  
  // Mutation for creating a new contact
  const createContactMutation = useMutation({
    mutationFn: (contactData: Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>) => 
      contactsApi.createContact(contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating contact:', error);
      toast.error(`Failed to create contact: ${error.message}`);
    },
  });
  
  // Mutation for updating a contact
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
    },
  });
  
  // Mutation for deleting a contact
  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => contactsApi.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting contact:', error);
      toast.error(`Failed to delete contact: ${error.message}`);
    },
  });
  
  // Mutation for setting a contact as primary
  const setPrimaryContactMutation = useMutation({
    mutationFn: ({ id, entityId, entityType }: { id: string; entityId: string; entityType: string }) => 
      contactsApi.setPrimaryContact(id, entityId, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Primary contact updated');
    },
    onError: (error: any) => {
      console.error('Error setting primary contact:', error);
      toast.error(`Failed to update primary contact: ${error.message}`);
    },
  });
  
  return {
    contacts: contactsQuery.data || [],
    isLoading: contactsQuery.isLoading,
    isError: contactsQuery.isError,
    error: contactsQuery.error,
    filter,
    setFilter,
    createContact: createContactMutation.mutate,
    updateContact: updateContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,
    setPrimaryContact: setPrimaryContactMutation.mutate,
    isCreating: createContactMutation.isPending,
    isUpdating: updateContactMutation.isPending,
    isDeleting: deleteContactMutation.isPending,
  };
}

export function useEntityContacts(entityId: string | undefined, entityType: string) {
  const queryClient = useQueryClient();
  
  // Query for fetching contacts for a specific entity
  const contactsQuery = useQuery({
    queryKey: ['contacts', entityType, entityId],
    queryFn: () => entityId ? contactsApi.getContactsByEntityId(entityId, entityType) : [],
    enabled: !!entityId,
  });
  
  // Mutation for creating a new contact
  const createContactMutation = useMutation({
    mutationFn: (contactData: Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>) => 
      contactsApi.createContact({
        ...contactData,
        entity_id: entityId!,
        entity_type: entityType,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', entityType, entityId] });
      toast.success('Contact added successfully');
    },
    onError: (error: any) => {
      console.error('Error creating contact:', error);
      toast.error(`Failed to add contact: ${error.message}`);
    },
  });
  
  // Mutation for deleting a contact
  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => contactsApi.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', entityType, entityId] });
      toast.success('Contact removed successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting contact:', error);
      toast.error(`Failed to remove contact: ${error.message}`);
    },
  });
  
  // Mutation for setting a contact as primary
  const setPrimaryContactMutation = useMutation({
    mutationFn: (id: string) => 
      contactsApi.setPrimaryContact(id, entityId!, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', entityType, entityId] });
      toast.success('Primary contact updated');
    },
    onError: (error: any) => {
      console.error('Error setting primary contact:', error);
      toast.error(`Failed to update primary contact: ${error.message}`);
    },
  });
  
  return {
    contacts: contactsQuery.data || [],
    isLoading: contactsQuery.isLoading,
    isError: contactsQuery.isError,
    error: contactsQuery.error,
    createContact: createContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,
    setPrimaryContact: setPrimaryContactMutation.mutate,
    isCreating: createContactMutation.isPending,
    isDeleting: deleteContactMutation.isPending,
  };
}
