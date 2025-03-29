import { useQuery } from '@tanstack/react-query';
import { contractHistoryApi } from '@/lib/api/sites/contractHistoryApi';

// Import from the updated location
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

export function useContractHistory(siteId: string | undefined) {
  const historyQuery = useQuery({
    queryKey: ['contractHistory', siteId],
    queryFn: async () => {
      if (!siteId) return [];
      try {
        return await contractHistoryApi.getContractHistory(siteId);
      } catch (error) {
        console.error('Failed to fetch contract history:', error);
        throw error;
      }
    },
    enabled: !!siteId,
    meta: {
      errorMessage: 'Failed to load contract history'
    }
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
    queryFn: async () => {
      if (!versionId) return null;
      try {
        return await contractHistoryApi.getContractHistoryEntry(versionId);
      } catch (error) {
        console.error('Failed to fetch contract version:', error);
        throw error;
      }
    },
    enabled: !!versionId,
    meta: {
      errorMessage: 'Failed to load contract version'
    }
  });

  return {
    version: versionQuery.data as ContractHistoryEntry | null,
    isLoading: versionQuery.isLoading,
    isError: versionQuery.isError,
    error: versionQuery.error
  };
}
