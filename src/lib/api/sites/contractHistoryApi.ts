
import { supabase } from '@/lib/supabase';
import { Json } from '@/types/common';
import { getUserId } from '@/lib/utils/auth';

export const contractHistoryApi = {
  /**
   * Fetches the contract history for a specific site
   */
  async getContractHistory(siteId: string) {
    try {
      const { data, error } = await supabase
        .from('site_contract_history')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(`Error fetching contract history: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error in getContractHistory:', error);
      throw error;
    }
  },
  
  /**
   * Saves a new version of the contract details
   */
  async saveContractVersion(siteId: string, contractDetails: any, notes: string) {
    try {
      // Get the current user ID for tracking who made the change
      const userId = await getUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // This will trigger the before-insert trigger that sets the version number
      const { data, error } = await supabase
        .from('site_contract_history')
        .insert({
          site_id: siteId,
          contract_details: contractDetails as Json,
          notes: notes,
          created_by: userId
        })
        .select();
        
      if (error) {
        throw new Error(`Error saving contract version: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error in saveContractVersion:', error);
      throw error;
    }
  },
  
  /**
   * Retrieves a specific version of the contract
   */
  async getContractVersion(historyId: string) {
    try {
      const { data, error } = await supabase
        .from('site_contract_history')
        .select('*')
        .eq('id', historyId)
        .single();
        
      if (error) {
        throw new Error(`Error fetching contract version: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error in getContractVersion:', error);
      throw error;
    }
  }
};
