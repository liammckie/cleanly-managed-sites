
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contactsApi } from '@/lib/api/contacts';
import { ContactRecord } from '@/lib/types';
import { useState } from 'react';

export interface ContactFilters {
  entityType?: string;
  entityId?: string;
  search?: string;
  role?: string;
  department?: string;
  isPrimary?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useContacts(initialFilters: ContactFilters = {}) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ContactFilters>(initialFilters);
  
  // Query for fetching contacts, filtered by entity type if provided
  const contactsQuery = useQuery({
    queryKey: ['contacts', filters],
    queryFn: () => contactsApi.getContacts(filters),
  });

  // Query for fetching available entities for the contacts
  const entitiesQuery = useQuery({
    queryKey: ['contact-entities'],
    queryFn: () => contactsApi.getContactEntities(),
  });
  
  // Calculate the count by entity type
  const contactTypeCount = {
    all: contactsQuery.data?.length || 0,
    client: contactsQuery.data?.filter(c => c.entity_type === 'client').length || 0,
    site: contactsQuery.data?.filter(c => c.entity_type === 'site').length || 0,
    supplier: contactsQuery.data?.filter(c => c.entity_type === 'supplier').length || 0,
    internal: contactsQuery.data?.filter(c => c.entity_type === 'internal').length || 0,
  };
  
  // Mutation for creating a new contact
  const createContactMutation = useMutation({
    mutationFn: (contactData: Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>) => 
      contactsApi.createContact(contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact-entities'] });
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
      queryClient.invalidateQueries({ queryKey: ['contact-entities'] });
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
      queryClient.invalidateQueries({ queryKey: ['contact-entities'] });
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
    availableEntities: entitiesQuery.data || [],
    contactTypeCount,
    isLoading: contactsQuery.isLoading || entitiesQuery.isLoading,
    isError: contactsQuery.isError || entitiesQuery.isError,
    error: contactsQuery.error || entitiesQuery.error,
    filters,
    setFilters,
    addContact: createContactMutation.mutate,
    updateContact: (id: string, data: Partial<ContactRecord>) => 
      updateContactMutation.mutate({ id, data }),
    deleteContact: deleteContactMutation.mutate,
    setPrimaryContact: (id: string, entityId: string, entityType: string) => 
      setPrimaryContactMutation.mutate({ id, entityId, entityType }),
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
