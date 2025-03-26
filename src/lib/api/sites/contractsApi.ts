
import { supabase } from '@/lib/supabase';
import { ContractData } from '@/lib/types/contracts';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

export const contractsApi = {
  // Get all contracts
  async getContracts(): Promise<ContractData[]> {
    const { data, error } = await supabase
      .from('sites')
      .select(`
        id, 
        name as site_name, 
        client_id, 
        client:clients(name as client_name),
        monthly_revenue,
        contract_details,
        status
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
    
    // Transform the data to the expected format
    return (data || []).map(item => ({
      id: item.id,
      site_id: item.id,
      site_name: item.site_name,
      client_id: item.client_id,
      client_name: item.client?.client_name || '',
      monthly_revenue: item.monthly_revenue,
      contract_details: item.contract_details,
      status: item.status
    }));
  },
  
  // Get contracts expiring soon
  async getExpiringContracts(days: number = 30): Promise<ContractData[]> {
    const { data, error } = await supabase.rpc('get_expiring_contracts', { days_threshold: days });
    
    if (error) {
      console.error('Error fetching expiring contracts:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Update contract
  async updateContract(siteId: string, contractDetails: Partial<ContractDetails>): Promise<void> {
    const { error } = await supabase
      .from('sites')
      .update({
        contract_details: contractDetails
      })
      .eq('id', siteId);
    
    if (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  }
};
