
import { useQuery } from '@tanstack/react-query';
import { fetchSiteContractHistory } from '@/lib/api/sites/siteContractHistoryApi';
import { Json } from '@/types';

export type ContractHistoryEntry = {
  id: string;
  site_id: string;
  contract_details: Json;
  notes: string;
  created_by: string;
  created_at: string;
  version_number: number;
};

export function useSiteContractHistory(siteId: string) {
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['siteContractHistory', siteId],
    queryFn: async () => {
      if (!siteId) return { history: [], currentDetails: {} };
      
      try {
        const historyData = await fetchSiteContractHistory(siteId);
        
        // Get the current contract details from the latest history entry
        const currentDetails = historyData.length > 0 
          ? historyData[0].contract_details 
          : {};
          
        return {
          history: historyData,
          currentDetails
        };
      } catch (err) {
        console.error('Error fetching site contract history:', err);
        return { history: [], currentDetails: {} };
      }
    },
    enabled: !!siteId,
    meta: {
      errorMessage: 'Failed to load contract history'
    }
  });
  
  return {
    history: data?.history || [],
    currentContractDetails: data?.currentDetails || {},
    isLoading,
    isError,
    error
  };
}

export default useSiteContractHistory;
