
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ContractData } from '@/lib/types/contracts';
import { ContractSummaryData, GroupedContracts } from '@/components/sites/contract/types';
import { supabase } from '@/lib/supabase';

/**
 * Hook to fetch and manage contract data
 */
export function useContracts() {
  const [groupedContracts, setGroupedContracts] = useState<GroupedContracts>({});
  const [metrics, setMetrics] = useState<ContractSummaryData>({
    expiringThisMonth: 0,
    expiringNext3Months: 0,
    expiringNext6Months: 0,
    expiringThisYear: 0,
    valueExpiringThisMonth: 0,
    valueExpiringNext3Months: 0,
    valueExpiringNext6Months: 0,
    valueExpiringThisYear: 0,
    totalContracts: 0,
    totalValue: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    avgContractValue: 0,
    profitMargin: 0,
    activeCount: 0
  });

  // Fetch contract data from the API
  const contractQuery = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('sites')
          .select(`
            id,
            name,
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
            site_name: site.name || '',
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
    meta: {
      onError: 'Failed to load contracts'
    }
  });

  // Process and organize contract data
  useEffect(() => {
    if (contractQuery.data) {
      const grouped: GroupedContracts = {};
      let totalValue = 0;
      let activeCount = 0;
      
      // Group contracts by status
      contractQuery.data.forEach(contract => {
        const status = contract.status || 'unknown';
        if (!grouped[status]) {
          grouped[status] = [];
        }
        grouped[status].push(contract);
        
        // Calculate total value (assuming monthly revenue * 12 for annual value)
        totalValue += (contract.monthly_revenue || 0) * 12;
        
        // Count active contracts
        if (status === 'active') {
          activeCount++;
        }
      });
      
      setGroupedContracts(grouped);
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        totalContracts: contractQuery.data.length,
        totalValue: totalValue,
        totalRevenue: totalValue,
        totalProfit: totalValue * 0.25, // Estimated profit
        avgContractValue: contractQuery.data.length > 0 ? totalValue / contractQuery.data.length : 0,
        profitMargin: totalValue > 0 ? 25 : 0, // Estimated profit margin
        activeCount: activeCount
      }));
    }
  }, [contractQuery.data]);

  return {
    contractData: contractQuery.data || [],
    groupedContracts,
    isLoading: contractQuery.isLoading,
    isError: contractQuery.isError,
    error: contractQuery.error,
    metrics
  };
}
