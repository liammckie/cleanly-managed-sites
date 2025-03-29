
import { supabase } from '@/lib/supabase';
import { ContractDetails, ContractHistoryEntry } from '@/types/contracts';
import { ContractDetails as SiteContractDetails } from '@/components/sites/forms/types/contractTypes';
import { Json } from '@/types/common';

/**
 * Fetch contract history for a site
 */
export const contractHistoryApi = {
  /**
   * Fetch contract history for a site
   * @param siteId Site ID
   * @returns Array of contract history entries
   */
  async fetchContractHistory(siteId: string): Promise<ContractHistoryEntry[]> {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contract history:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },
  
  /**
   * Save a new version of contract details
   * @param siteId Site ID
   * @param contractDetails Contract details
   * @param notes Notes about this version
   * @returns Created contract history entry
   */
  async saveContractVersion(
    siteId: string, 
    contractDetails: ContractDetails | SiteContractDetails | Json,
    notes?: string
  ): Promise<ContractHistoryEntry> {
    // First, get the latest version number
    const { data: latestVersion, error: versionError } = await supabase
      .from('site_contract_history')
      .select('version_number')
      .eq('site_id', siteId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();
    
    if (versionError && versionError.code !== 'PGRST116') { // Not found is ok
      console.error('Error getting latest version:', versionError);
      throw new Error(versionError.message);
    }
    
    const nextVersion = latestVersion ? (latestVersion.version_number + 1) : 1;
    
    // Convert contract details to a serializable JSON object if needed
    const safeContractDetails = 
      typeof contractDetails === 'string' ? 
        JSON.parse(contractDetails) : 
        contractDetails;
    
    // Insert the new version
    const { data, error } = await supabase
      .from('site_contract_history')
      .insert({
        site_id: siteId,
        contract_details: safeContractDetails as Json,
        version_number: nextVersion,
        notes: notes || 'Contract details updated'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving contract version:', error);
      throw new Error(error.message);
    }
    
    return data;
  }
};
