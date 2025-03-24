
import { useQuery } from '@tanstack/react-query';
import { clientsApi, ClientRecord } from '@/lib/api';
import { useClientStats } from './useClientStats';
import { useClientMutations } from './useClientMutations';
import { useClientDetails } from './useClientDetails';

export function useClients() {
  // Query for fetching all clients
  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.getClients,
  });
  
  // Get client statistics from the dedicated hook
  const { statusCounts, totalCount, isLoading: isStatsLoading } = useClientStats();
  
  // Get client mutations from the dedicated hook
  const { 
    createClient, 
    updateClient, 
    deleteClient, 
    isCreating, 
    isUpdating, 
    isDeleting 
  } = useClientMutations();
  
  return {
    clients: clientsQuery.data || [],
    statusCounts,
    totalCount,
    isLoading: clientsQuery.isLoading || isStatsLoading,
    isError: clientsQuery.isError,
    error: clientsQuery.error,
    createClient,
    updateClient,
    deleteClient,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// Re-export useClientDetails to maintain backward compatibility
export { useClientDetails } from './useClientDetails';
