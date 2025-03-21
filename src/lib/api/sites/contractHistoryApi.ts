
import { supabase } from '@/integrations/supabase/client';
import { ContractDetails, ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

export const contractHistoryApi = {
  // Save a new version of contract details to history
  async saveContractVersion(
    siteId: string, 
    contractDetails: ContractDetails, 
    notes?: string
  ): Promise<ContractHistoryEntry> {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First get the current max version number for this site
    const { data: versionData } = await supabase
      .from('site_contract_history')
      .select('version_number')
      .eq('site_id', siteId)
      .order('version_number', { ascending: false })
      .limit(1);
    
    // Calculate next version number
    const nextVersion = versionData && versionData.length > 0 
      ? (versionData[0].version_number + 1) 
      : 1;

    // Insert with explicit version number to satisfy TypeScript
    const { data, error } = await supabase
      .from('site_contract_history')
      .insert({
        site_id: siteId,
        contract_details: contractDetails,
        created_by: user.id,
        notes: notes || null,
        version_number: nextVersion // Set version explicitly for TypeScript
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving contract version:', error);
      throw error;
    }

    return data as ContractHistoryEntry;
  },

  // Get all contract versions for a site
  async getContractHistory(siteId: string): Promise<ContractHistoryEntry[]> {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('site_id', siteId)
      .order('version_number', { ascending: false });

    if (error) {
      console.error(`Error fetching contract history for site ${siteId}:`, error);
      throw error;
    }

    return data as ContractHistoryEntry[];
  },

  // Get a specific contract version
  async getContractVersion(id: string): Promise<ContractHistoryEntry> {
    const { data, error } = await supabase
      .from('site_contract_history')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching contract version with ID ${id}:`, error);
      throw error;
    }

    return data as ContractHistoryEntry;
  }
};
