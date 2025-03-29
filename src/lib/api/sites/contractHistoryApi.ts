
import { supabase } from '@/lib/supabase';
import { Json } from '@/lib/types/common';
import { ContractHistoryEntry } from '@/lib/types/contracts';

/**
 * Save a new version of a contract's details to the history table
 */
export async function saveContractVersion(
  siteId: string,
  contractDetails: Json, 
  notes: string = '', 
  userId: string = ''
): Promise<boolean> {
  try {
    // Get the current highest version number
    const { data: versionData, error: versionError } = await supabase
      .from('site_contract_history')
      .select('version_number')
      .eq('site_id', siteId)
      .order('version_number', { ascending: false })
      .limit(1);

    if (versionError) {
      console.error('Error fetching contract version:', versionError);
      return false;
    }

    const newVersionNumber = versionData && versionData.length > 0 
      ? (versionData[0].version_number + 1) 
      : 1;

    // Insert the new version
    const { error } = await supabase
      .from('site_contract_history')
      .insert({
        site_id: siteId,
        contract_details: contractDetails,
        notes,
        created_by: userId,
        version_number: newVersionNumber
      });

    if (error) {
      console.error('Error saving contract version:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveContractVersion:', error);
    return false;
  }
}

/**
 * Get the contract history for a site
 */
export async function getContractHistory(siteId: string): Promise<ContractHistoryEntry[]> {
  try {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('site_id', siteId)
      .order('version_number', { ascending: false });

    if (error) {
      console.error('Error fetching contract history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getContractHistory:', error);
    return [];
  }
}

/**
 * Get a specific contract history entry by ID
 */
export async function getContractHistoryEntry(entryId: string): Promise<ContractHistoryEntry | null> {
  try {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('id', entryId)
      .single();

    if (error) {
      console.error('Error fetching contract history entry:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getContractHistoryEntry:', error);
    return null;
  }
}

export const contractHistoryApi = {
  saveContractVersion,
  getContractHistory,
  getContractHistoryEntry
};
