
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clientsApi, ClientRecord } from '@/lib/api';

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
  
  // Mutation for updating a client
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
