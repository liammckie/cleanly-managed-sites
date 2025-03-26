
import { supabase } from '@/lib/supabase';
import { ContractData } from '@/lib/types/contracts';

export const contractsApi = {
  async getContracts(): Promise<ContractData[]> {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select(`
          id,
          name, 
          client_id, 
          clients(name),
          monthly_revenue,
          contract_details,
          status
        `)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching contracts:', error);
        throw error;
      }

      // Process data to match ContractData type
      return (data || []).map(site => {
        return {
          id: site.id,
          site_id: site.id,
          site_name: site.name,
          client_id: site.client_id,
          client_name: site.clients?.name || '',
          monthly_revenue: site.monthly_revenue,
          contract_details: site.contract_details,
          status: site.status,
          is_primary: true // Add the required is_primary field
        };
      });
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  },

  async getExpiredContracts(): Promise<ContractData[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('sites')
        .select(`
          id,
          name, 
          client_id, 
          clients(name),
          monthly_revenue,
          contract_details,
          status
        `)
        .neq('status', 'inactive');

      if (error) {
        console.error('Error fetching expired contracts:', error);
        throw error;
      }

      // Filter contracts manually to check expiration date
      const expiredContracts = (data || []).filter(site => {
        if (!site.contract_details || !site.contract_details.endDate) return false;
        
        const endDate = new Date(site.contract_details.endDate);
        return endDate < new Date(today);
      });

      return expiredContracts.map(site => {
        return {
          id: site.id,
          site_id: site.id,
          site_name: site.name,
          client_id: site.client_id,
          client_name: site.clients?.name || '',
          monthly_revenue: site.monthly_revenue,
          contract_details: site.contract_details,
          status: site.status,
          is_primary: true // Add the required is_primary field
        };
      });
    } catch (error) {
      console.error('Error fetching expired contracts:', error);
      throw error;
    }
  }
};
