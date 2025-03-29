
import { useState, useEffect } from 'react';
import { contractHistoryApi, ContractHistoryEntry } from '@/lib/api/sites/contractHistoryApi';
import { Json } from '@/types/common';
import { toast } from 'sonner';

export function useSiteContractHistory(siteId?: string) {
  const [history, setHistory] = useState<ContractHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchHistory = async () => {
    if (!siteId) return;
    
    try {
      setIsLoading(true);
      setIsError(false);
      
      const data = await contractHistoryApi.fetchContractHistory(siteId);
      setHistory(data);
    } catch (error) {
      console.error('Error fetching contract history:', error);
      setIsError(true);
      toast.error('Failed to load contract history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [siteId]);

  const getContractVersion = async (versionId: string): Promise<ContractHistoryEntry | null> => {
    try {
      return await contractHistoryApi.getContractVersion(versionId);
    } catch (error) {
      console.error('Error fetching contract version:', error);
      toast.error('Failed to load contract version');
      return null;
    }
  };

  const saveContractVersion = async (
    contractDetails: Json,
    notes?: string
  ): Promise<ContractHistoryEntry | null> => {
    if (!siteId) return null;
    
    try {
      const result = await contractHistoryApi.saveContractVersion(
        siteId, 
        contractDetails, 
        notes
      );
      
      // Refresh the history
      fetchHistory();
      
      return result;
    } catch (error) {
      console.error('Error saving contract version:', error);
      toast.error('Failed to save contract version');
      return null;
    }
  };

  return {
    history,
    isLoading,
    isError,
    fetchHistory,
    getContractVersion,
    saveContractVersion
  };
}

export type { ContractHistoryEntry };
