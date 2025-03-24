
import { useQuery } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api';

export function useClientStats() {
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
  
  return {
    statusCounts: clientStatusCountsQuery.data || { active: 0, inactive: 0, pending: 0 },
    totalCount: clientsTotalCountQuery.data || 0,
    isLoading: clientStatusCountsQuery.isLoading || clientsTotalCountQuery.isLoading,
    isError: clientStatusCountsQuery.isError || clientsTotalCountQuery.isError,
    error: clientStatusCountsQuery.error || clientsTotalCountQuery.error,
  };
}
