
// Let's fix the property names to match the correct interfaces
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/utils/auth';
import { ContractHistoryEntry } from '@/types/contracts';

/**
 * Fetch history of contract versions for a site
 * @param siteId The site ID to fetch contract history for
 */
export const getContractHistory = async (siteId: string): Promise<ContractHistoryEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('site_id', siteId)
      .order('version_number', { ascending: false });
      
    if (error) {
      console.error('Error fetching contract history:', error);
      throw error;
    }
    
    return data as ContractHistoryEntry[];
  } catch (error) {
    console.error('Error in getContractHistory:', error);
    throw error;
  }
};

/**
 * Fetch a specific contract version from history
 * @param historyId The ID of the history entry
 */
export const getContractVersion = async (historyId: string): Promise<ContractHistoryEntry> => {
  try {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('id', historyId)
      .single();
      
    if (error) {
      console.error('Error fetching contract version:', error);
      throw error;
    }
    
    return data as ContractHistoryEntry;
  } catch (error) {
    console.error('Error in getContractVersion:', error);
    throw error;
  }
};

/**
 * Save a new version of contract details to history
 * @param siteId The site ID 
 * @param contractDetails The contract details to save
 * @param notes Notes about this version
 */
export const saveContractVersion = async (
  siteId: string, 
  contractDetails: any, 
  notes: string
): Promise<ContractHistoryEntry> => {
  try {
    const user = await getCurrentUser();
    
    // The trigger function will handle setting the version_number
    const { data, error } = await supabase
      .from('site_contract_history')
      .insert({
        site_id: siteId,
        contract_details: contractDetails,
        notes: notes,
        created_by: user?.id
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error saving contract version:', error);
      throw error;
    }
    
    return data as ContractHistoryEntry;
  } catch (error) {
    console.error('Error in saveContractVersion:', error);
    throw error;
  }
};

export const contractHistoryApi = {
  getContractHistory,
  getContractVersion,
  saveContractVersion
};
