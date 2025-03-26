
import { useQuery } from '@tanstack/react-query';
import { contractHistoryApi } from '@/lib/api/sites/siteContractHistoryApi';
import { Json } from '@/types';

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: Json;
  version_number: number;
  notes?: string;
  created_by?: string;
  created_at: string;
}

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
