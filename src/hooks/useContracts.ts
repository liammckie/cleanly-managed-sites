
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contractsApi } from '@/lib/api/sites/contractsApi';
import { ContractData } from '@/lib/types/contracts';
import { ContractSummaryData } from '@/components/sites/contract/types';

export function useContracts() {
  const [groupedContracts, setGroupedContracts] = useState<Record<string, ContractData[]>>({});
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
    profitMargin: 0
  });

  // Fetch contract data
  const contractQuery = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      return await contractsApi.getContracts();
    },
    meta: {
      onError: 'Failed to load contracts'
    }
  });

  // Process and organize contract data
  useEffect(() => {
    if (contractQuery.data) {
      const grouped: Record<string, ContractData[]> = {};
      let totalValue = 0;
      
      // Group contracts by status
      contractQuery.data.forEach(contract => {
        const status = contract.status || 'unknown';
        if (!grouped[status]) {
          grouped[status] = [];
        }
        grouped[status].push(contract);
        
        // Calculate total value (assuming monthly revenue * 12 for annual value)
        totalValue += (contract.monthly_revenue || 0) * 12;
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
        profitMargin: totalValue > 0 ? 25 : 0 // Estimated profit margin
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
