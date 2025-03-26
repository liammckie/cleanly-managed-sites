
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { JsonValue } from '@/types/common';

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: JsonValue;
  created_at: string;
  created_by?: string;
  version_number: number;
  notes?: string;
}

export function useSiteContractHistory(siteId: string) {
  const [history, setHistory] = useState<ContractHistoryEntry[]>([]);
  const [currentContractDetails, setCurrentContractDetails] = useState<JsonValue>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['contractHistory', siteId],
    queryFn: async () => {
      if (!siteId) return { history: [], currentDetails: {} };

      // Fetch contract history
      const { data: historyData, error: historyError } = await supabase
        .from('site_contract_history')
        .select('*')
        .eq('site_id', siteId)
        .order('version_number', { ascending: false });

      if (historyError) {
        throw new Error(historyError.message);
      }

      // Fetch current site contract details
      const { data: siteData, error: siteError } = await supabase
        .from('sites')
        .select('contract_details')
        .eq('id', siteId)
        .single();

      if (siteError && siteError.code !== 'PGRST116') {
        throw new Error(siteError.message);
      }

      return { 
        history: historyData || [], 
        currentDetails: siteData?.contract_details || {} 
      };
    },
    enabled: !!siteId,
    onError: (err: Error) => {
      toast.error(`Error loading contract history: ${err.message}`);
    }
  });

  useEffect(() => {
    if (data) {
      setHistory(data.history);
      setCurrentContractDetails(data.currentDetails);
    }
  }, [data]);

  return { history, isLoading, error, currentContractDetails };
}
