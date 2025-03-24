
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '@/lib/api/contactsApi';
import { ContactRecord } from '@/lib/types';
import { toast } from 'sonner';

export type ContactFilters = {
  entityType?: string;
  search?: string;
  department?: string;
  role?: string;
  isPrimary?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export function useContacts(initialFilters: ContactFilters = {}) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ContactFilters>(initialFilters);
  
  // Fetch all contacts
  const { 
    data: contacts = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['contacts', filters],
    queryFn: () => contactsApi.getContacts(filters),
  });

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [filters, refetch]);

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

  // Search for entities to link contacts to
  const searchEntities = async (query: string, entityType?: string) => {
    if (!query || query.length < 2) return [];
    
    try {
      const results = await contactsApi.searchEntities(query, entityType);
      return results || [];
    } catch (error) {
      console.error('Error searching entities:', error);
      toast.error('Failed to search entities');
      return [];
    }
  };

  // Calculate entity type counts
  const contactTypeCount = {
    all: contacts.length,
    client: contacts.filter(c => c.entity_type === 'client').length,
    site: contacts.filter(c => c.entity_type === 'site').length,
    supplier: contacts.filter(c => c.entity_type === 'supplier').length,
    internal: contacts.filter(c => c.entity_type === 'internal').length
  };

  return {
    contacts,
    filters,
    setFilters,
    contactTypeCount,
    isLoading: isLoading || addContactMutation.isPending || updateContactMutation.isPending || deleteContactMutation.isPending,
    error,
    isCreating: addContactMutation.isPending,
    isUpdating: updateContactMutation.isPending,
    isDeleting: deleteContactMutation.isPending,
    searchEntities,
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

// Function for getting contacts related to a specific entity
export function useEntityContacts(entityId?: string, entityType?: 'client' | 'site' | 'supplier' | 'internal') {
  const queryClient = useQueryClient();
  
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['entity-contacts', entityType, entityId],
    queryFn: () => 
      entityId && entityType 
        ? contactsApi.getContactsByEntityId(entityId, entityType)
        : Promise.resolve([]),
    enabled: !!entityId && !!entityType,
  });
  
  const createContactMutation = useMutation({
    mutationFn: (contactData: Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>) => {
      // Ensure entity_id and entity_type are set correctly
      const formattedData = {
        ...contactData,
        entity_id: entityId,
        entity_type: entityType
      };
      return contactsApi.createContact(formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity-contacts', entityType, entityId] });
      toast.success('Contact added successfully');
    },
    onError: (error: any) => {
      console.error('Error creating contact:', error);
      toast.error(`Failed to add contact: ${error.message}`);
    },
  });
  
  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => contactsApi.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity-contacts', entityType, entityId] });
      toast.success('Contact removed successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting contact:', error);
      toast.error(`Failed to remove contact: ${error.message}`);
    },
  });
  
  const setPrimaryContactMutation = useMutation({
    mutationFn: (id: string) => 
      contactsApi.setPrimaryContact(id, entityId!, entityType!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity-contacts', entityType, entityId] });
      toast.success('Primary contact updated');
    },
    onError: (error: any) => {
      console.error('Error setting primary contact:', error);
      toast.error(`Failed to update primary contact: ${error.message}`);
    },
  });
  
  return {
    contacts,
    isLoading,
    isError: !!error,
    error,
    createContact: createContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,
    setPrimaryContact: setPrimaryContactMutation.mutate,
    isCreating: createContactMutation.isPending,
    isDeleting: deleteContactMutation.isPending,
  };
}
