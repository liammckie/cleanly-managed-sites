
import { supabase } from '@/lib/supabase';
import { ContractData } from '@/lib/types/contracts';
import { asJsonObject } from '@/lib/utils/json';

export const contractsApi = {
  // Get all contracts
  getContracts: async (): Promise<ContractData[]> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select(`
          id,
          name as site_name,
          client_id,
          client_name,
          monthly_revenue,
          contract_details,
          status
        `)
        .order('name');

      if (error) throw error;

      // Transform the data to the expected format with defaults
      return (data || []).map(site => {
        return {
          id: site.id,
          site_id: site.id,
          site_name: site.site_name || '',
          client_id: site.client_id || '',
          client_name: site.client_name || '',
          monthly_revenue: site.monthly_revenue || 0,
          contract_details: site.contract_details || {},
          status: site.status || 'inactive',
          is_primary: true // Default to primary
        };
      });
    } catch (error) {
      console.error('Error fetching contracts:', error);
      return [];
    }
  },

  // Get contracts expiring within a specific timeframe
  getExpiringContracts: async (days: number = 90): Promise<ContractData[]> => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select(`
          id,
          name as site_name,
          client_id,
          client_name,
          monthly_revenue,
          contract_details,
          status
        `);

      if (error) throw error;

      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      // Filter contracts expiring in the specified timeframe
      return (data || [])
        .filter(site => {
          const contractDetails = asJsonObject(site.contract_details, {});
          const endDateStr = contractDetails.endDate as string | undefined;
          
          if (!endDateStr) return false;
          
          const endDate = new Date(endDateStr);
          return endDate >= now && endDate <= futureDate;
        })
        .map(site => ({
          id: site.id,
          site_id: site.id,
          site_name: site.site_name || '',
          client_id: site.client_id || '',
          client_name: site.client_name || '',
          monthly_revenue: site.monthly_revenue || 0,
          contract_details: site.contract_details || {},
          status: site.status || 'inactive',
          is_primary: true
        }));
    } catch (error) {
      console.error('Error fetching expiring contracts:', error);
      return [];
    }
  }
};
