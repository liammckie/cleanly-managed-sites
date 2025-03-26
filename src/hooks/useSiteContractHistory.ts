
import { useQuery } from '@tanstack/react-query';
import { contractHistoryApi } from '@/lib/api/sites/siteContractHistoryApi';

export function useSiteContractHistory(siteId?: string) {
  const {
    data: contractHistory,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['site-contract-history', siteId],
    queryFn: () => siteId ? contractHistoryApi.fetchContractHistory(siteId) : Promise.resolve([]),
    enabled: !!siteId
  });

  return {
    contractHistory: contractHistory || [],
    isLoading,
    error,
    refetch
  };
}
