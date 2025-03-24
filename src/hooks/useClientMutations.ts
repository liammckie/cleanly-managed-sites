
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clientsApi, ClientRecord } from '@/lib/api';

export function useClientMutations() {
  const queryClient = useQueryClient();
  
  // Mutation for creating a new client
  const createClientMutation = useMutation({
    mutationFn: (clientData: Partial<ClientRecord>) => clientsApi.createClient(clientData),
    onSuccess: () => {
      // Invalidate the clients query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clientStatusCounts'] });
      queryClient.invalidateQueries({ queryKey: ['clientsTotalCount'] });
      toast.success('Client created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating client:', error);
      toast.error(`Failed to create client: ${error.message}`);
    },
  });
  
  // Mutation for updating a client
  const updateClientMutation = useMutation({
    mutationFn: (data: { id: string; data: Partial<ClientRecord> }) => 
      clientsApi.updateClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clientStatusCounts'] });
      toast.success('Client updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating client:', error);
      toast.error(`Failed to update client: ${error.message}`);
    },
  });
  
  // Mutation for deleting a client
  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => clientsApi.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clientStatusCounts'] });
      queryClient.invalidateQueries({ queryKey: ['clientsTotalCount'] });
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Client deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting client:', error);
      toast.error(`Failed to delete client: ${error.message}`);
    },
  });
  
  return {
    createClient: createClientMutation.mutateAsync,
    updateClient: updateClientMutation.mutateAsync,
    deleteClient: deleteClientMutation.mutateAsync,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
}
