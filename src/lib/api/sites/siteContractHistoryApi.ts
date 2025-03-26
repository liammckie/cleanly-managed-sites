
import { supabase } from '@/lib/supabase';
import { ContractHistoryEntry } from '@/hooks/useSiteContractHistory';

export async function fetchSiteContractHistory(siteId: string): Promise<ContractHistoryEntry[]> {
  if (!siteId) {
    throw new Error('Site ID is required to fetch contract history');
  }

  const { data, error } = await supabase
    .from('site_contract_history')
    .select('*')
    .eq('site_id', siteId)
    .order('version_number', { ascending: false });

  if (error) {
    console.error('Error fetching site contract history:', error);
    throw error;
  }

  return data || [];
}

export async function createSiteContractHistoryEntry(entry: Omit<ContractHistoryEntry, 'id' | 'created_at' | 'version_number'>) {
  const { data, error } = await supabase
    .from('site_contract_history')
    .insert(entry)
    .select()
    .single();

  if (error) {
    console.error('Error creating site contract history entry:', error);
    throw error;
  }

  return data;
}
