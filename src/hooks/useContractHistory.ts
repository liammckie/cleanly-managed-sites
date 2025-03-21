
import { useQuery } from '@tanstack/react-query';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

export function useContractHistory(siteId: string | undefined) {
  const historyQuery = useQuery({
    queryKey: ['contractHistory', siteId],
    queryFn: () => siteId ? contractHistoryApi.getContractHistory(siteId) : Promise.resolve([]),
    enabled: !!siteId
  });

  return {
    history: historyQuery.data as ContractHistoryEntry[] || [],
    isLoading: historyQuery.isLoading,
    isError: historyQuery.isError,
    error: historyQuery.error
  };
}

export function useContractVersion(versionId: string | undefined) {
  const versionQuery = useQuery({
    queryKey: ['contractVersion', versionId],
    queryFn: () => versionId ? contractHistoryApi.getContractVersion(versionId) : Promise.resolve(null),
    enabled: !!versionId
  });

  return {
    version: versionQuery.data as ContractHistoryEntry | null,
    isLoading: versionQuery.isLoading,
    isError: versionQuery.isError,
    error: versionQuery.error
  };
}
