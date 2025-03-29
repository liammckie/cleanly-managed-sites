
import { supabase } from '@/lib/supabase';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

export const fetchSiteContractHistory = async (siteId: string): Promise<ContractHistoryEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching site contract history:', error);
      throw new Error('Failed to fetch site contract history');
    }
    
    return data as unknown as ContractHistoryEntry[];
  } catch (error) {
    console.error('Error in fetchSiteContractHistory:', error);
    throw error;
  }
};

export const fetchContractHistoryEntry = async (historyId: string): Promise<ContractHistoryEntry | null> => {
  try {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('id', historyId)
      .single();
    
    if (error) {
      console.error('Error fetching contract history entry:', error);
      if (error.code === 'PGRST116') {
        // Not found error
        return null;
      }
      throw new Error('Failed to fetch contract history entry');
    }
    
    return data as unknown as ContractHistoryEntry;
  } catch (error) {
    console.error('Error in fetchContractHistoryEntry:', error);
    throw error;
  }
};

export const createContractHistoryEntry = async (entry: Omit<ContractHistoryEntry, 'id' | 'created_at' | 'version_number'>): Promise<ContractHistoryEntry> => {
  try {
    const { data, error } = await supabase
      .from('site_contract_history')
      .insert(entry)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating contract history entry:', error);
      throw new Error('Failed to create contract history entry');
    }
    
    return data as unknown as ContractHistoryEntry;
  } catch (error) {
    console.error('Error in createContractHistoryEntry:', error);
    throw error;
  }
};
