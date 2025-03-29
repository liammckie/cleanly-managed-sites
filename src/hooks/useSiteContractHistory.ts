
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ContractHistoryEntry } from '@/types/contracts';
import { Json } from '@/types/common';

// Export the ContractHistoryEntry type for components to use
export type { ContractHistoryEntry };

// Define API functions for contract history
export const contractHistoryApi = {
  fetchContractHistory: async (siteId: string): Promise<ContractHistoryEntry[]> => {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching contract history: ${error.message}`);
    }

    return data as ContractHistoryEntry[];
  },

  getContractVersion: async (versionId: string): Promise<ContractHistoryEntry> => {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('id', versionId)
      .single();

    if (error) {
      throw new Error(`Error fetching contract version: ${error.message}`);
    }

    return data as ContractHistoryEntry;
  },

  saveContractVersion: async (
    siteId: string,
    contractDetails: Json,
    notes?: string
  ): Promise<ContractHistoryEntry> => {
    // Since we need to let the database trigger handle version_number,
    // we'll omit it from our insert and let the trigger handle it
    const entry = {
      site_id: siteId,
      contract_details: contractDetails,
      notes,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    };

    const { data, error } = await supabase
      .from('site_contract_history')
      .insert(entry)
      .select()
      .single();

    if (error) {
      throw new Error(`Error saving contract version: ${error.message}`);
    }

    return data as ContractHistoryEntry;
  }
};

export function useSiteContractHistory(siteId: string) {
  const {
    data: contractHistory,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['contractHistory', siteId],
    queryFn: () => contractHistoryApi.fetchContractHistory(siteId),
    enabled: !!siteId
  });

  const saveVersionMutation = useMutation({
    mutationFn: (params: { 
      contractDetails: Json; 
      notes?: string 
    }) => contractHistoryApi.saveContractVersion(
      siteId, 
      params.contractDetails, 
      params.notes
    ),
    onSuccess: () => {
      refetch();
    }
  });

  return {
    contractHistory: contractHistory || [],
    isLoading,
    error: error as Error | null,
    saveVersion: saveVersionMutation.mutate,
    isSaving: saveVersionMutation.isPending,
    refetch
  };
}
