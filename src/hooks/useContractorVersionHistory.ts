
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contractorHistoryApi } from '@/lib/api/contractors';
import { ContractorVersionHistoryEntry } from '@/lib/types';

export function useContractorVersionHistory(contractorId: string | null) {
  const historyQuery = useQuery({
    queryKey: ['contractor-history', contractorId],
    queryFn: () => contractorId ? contractorHistoryApi.getContractorHistory(contractorId) : Promise.resolve([]),
    enabled: !!contractorId,
    onError: (error: any) => {
      console.error('Error fetching contractor history:', error);
      toast.error(`Failed to load contractor history: ${error.message || 'Unknown error'}`);
    }
  });

  return {
    history: historyQuery.data as ContractorVersionHistoryEntry[] | undefined,
    isLoading: historyQuery.isLoading,
    isError: historyQuery.isError,
    error: historyQuery.error,
  };
}
