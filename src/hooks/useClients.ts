
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clientsApi, ClientRecord } from '@/lib/api';

export function useClients() {
  const queryClient = useQueryClient();
  
  // Query for fetching all clients
  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.getClients,
  });
  
  // Query for client status counts
  const clientStatusCountsQuery = useQuery({
    queryKey: ['clientStatusCounts'],
    queryFn: clientsApi.getClientCountByStatus,
  });
  
  // Total client count
  const clientsTotalCountQuery = useQuery({
    queryKey: ['clientsTotalCount'],
    queryFn: clientsApi.getClientsTotalCount,
  });
  
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
  
  // Mutation for updating a client - fix the arguments to match clientsApi.updateClient
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
    clients: clientsQuery.data || [],
    statusCounts: clientStatusCountsQuery.data || { active: 0, inactive: 0, pending: 0 },
    totalCount: clientsTotalCountQuery.data || 0,
    isLoading: clientsQuery.isLoading || clientStatusCountsQuery.isLoading,
    isError: clientsQuery.isError,
    error: clientsQuery.error,
    createClient: createClientMutation.mutateAsync,
    updateClient: updateClientMutation.mutateAsync,
    deleteClient: deleteClientMutation.mutateAsync,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
}

export function useClientDetails(clientId: string | undefined) {
  const queryClient = useQueryClient();
  
  // Query for fetching a single client by ID
  const clientQuery = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientId ? clientsApi.getClientById(clientId) : null,
    enabled: !!clientId, // Only run the query if clientId is provided
  });
  
  // Query for fetching sites belonging to this client
  const clientSitesQuery = useQuery({
    queryKey: ['clientSites', clientId],
    queryFn: () => clientId ? clientsApi.getClientSites(clientId) : [],
    enabled: !!clientId, // Only run the query if clientId is provided
  });
  
  // Mutation for updating a client - fix the arguments to match clientsApi.updateClient
  const updateClientMutation = useMutation({
    mutationFn: (data: Partial<ClientRecord>) => 
      clientId ? clientsApi.updateClient({ id: clientId, data }) : Promise.reject('No client ID provided'),
    onSuccess: () => {
      // Invalidate both the clients list and the current client detail
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      queryClient.invalidateQueries({ queryKey: ['clientStatusCounts'] });
      toast.success('Client updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating client:', error);
      toast.error(`Failed to update client: ${error.message}`);
    },
  });
  
  return {
    client: clientQuery.data as ClientRecord | null,
    sites: clientSitesQuery.data || [],
    isLoading: clientQuery.isLoading || clientSitesQuery.isLoading,
    isError: clientQuery.isError || clientSitesQuery.isError,
    error: clientQuery.error || clientSitesQuery.error,
    updateClient: updateClientMutation.mutate,
    isUpdating: updateClientMutation.isPending,
  };
}
