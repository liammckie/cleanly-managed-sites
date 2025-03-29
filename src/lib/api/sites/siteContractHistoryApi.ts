
import { supabase } from '@/lib/supabase';
import { Json } from '@/lib/types/common';
import { ContractHistoryEntry } from '@/lib/types/contracts';

export const fetchSiteContractHistory = async (siteId: string): Promise<ContractHistoryEntry[]> => {
  try {
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
  } catch (error) {
    console.error('Error in fetchSiteContractHistory:', error);
    return [];
  }
};

export const saveSiteContractVersion = async (
  siteId: string, 
  contractDetails: Json, 
  notes: string = '', 
  userId: string = ''
): Promise<{ success: boolean; error?: string }> => {
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
      return { success: false, error: versionError.message };
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
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in saveSiteContractVersion:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};
