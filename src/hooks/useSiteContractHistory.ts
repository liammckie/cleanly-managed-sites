
import { useQuery } from '@tanstack/react-query';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';
import { ContractHistoryEntry } from '@/types/contracts';

export function useSiteContractHistory(siteId?: string) {
  const fetchContractHistory = async (): Promise<ContractHistoryEntry[]> => {
    if (!siteId) return [];
    return await contractHistoryApi.getContractHistory(siteId);
  };

  const query = useQuery({
    queryKey: ['contractHistory', siteId],
    queryFn: fetchContractHistory,
    enabled: !!siteId,
  });

  return {
    history: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
