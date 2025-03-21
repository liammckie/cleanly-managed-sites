
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContactRecord } from '@/lib/types';
import { toast } from 'sonner';

export const useContacts = (entityType: 'client' | 'site', entityId?: string) => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch contacts
  const {
    data: contacts = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['contacts', entityType, entityId],
    queryFn: async () => {
      if (!entityId) return [];
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('is_primary', { ascending: false })
        .order('name');
      
      if (error) {
        console.error(`Error fetching ${entityType} contacts:`, error);
        throw error;
      }
      
      return data as ContactRecord[];
    },
    enabled: !!entityId
  });

  // Create contact
  const createContact = useMutation({
    mutationFn: async (contact: Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>) => {
      setIsCreating(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('contacts')
        .insert({ ...contact, user_id: user.id })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating contact:', error);
        throw error;
      }
      
      return data as ContactRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', entityType, entityId] });
      toast.success('Contact created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create contact: ${error.message}`);
    },
    onSettled: () => {
      setIsCreating(false);
    }
  });

  // Update contact
  const updateContact = useMutation({
    mutationFn: async (contact: Partial<ContactRecord> & { id: string }) => {
      setIsUpdating(true);
      
      const { data, error } = await supabase
        .from('contacts')
        .update(contact)
        .eq('id', contact.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating contact:', error);
        throw error;
      }
      
      return data as ContactRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', entityType, entityId] });
      toast.success('Contact updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update contact: ${error.message}`);
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  });

  // Delete contact
  const deleteContact = useMutation({
    mutationFn: async (contactId: string) => {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);
      
      if (error) {
        console.error('Error deleting contact:', error);
        throw error;
      }
      
      return contactId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', entityType, entityId] });
      toast.success('Contact deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  return {
    contacts,
    isLoading,
    error,
    refetch,
    createContact: createContact.mutate,
    updateContact: updateContact.mutate,
    deleteContact: deleteContact.mutate,
    isCreating,
    isUpdating,
    isDeleting
  };
};
