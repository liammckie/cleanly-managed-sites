
import React from 'react';
import { useContracts } from '@/hooks/useContracts';
import { ContractSummarySection } from './ContractSummarySection';
import { ContractCharts } from './ContractCharts';
import { ContractExpiryList } from './ContractExpiryList'; 
import { useContractForecast } from '@/hooks/useContractForecast';
import { useQuery } from '@tanstack/react-query';
import { SiteRecord } from '@/lib/types';
import { ContractSummaryData } from './types';

/**
 * Dashboard component for contract management
 * Displays summary metrics, charts, and upcoming expirations
 */
export function ContractDashboard() {
  const { contractData, groupedContracts, isLoading, metrics } = useContracts();
  const { data: forecastData } = useContractForecast();
  const { data: sitesData } = useSites();
  
  // Convert summary data to the expected format
  const summaryData: ContractSummaryData = forecastData?.summaryData || {
    expiringThisMonth: 0,
    expiringNext3Months: 0,
    expiringNext6Months: 0,
    expiringThisYear: 0,
    valueExpiringThisMonth: 0,
    valueExpiringNext3Months: 0,
    valueExpiringNext6Months: 0,
    valueExpiringThisYear: 0,
    totalContracts: metrics?.totalContracts || 0,
    totalValue: metrics?.totalValue || 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    avgContractValue: 0,
    profitMargin: 0
  };
  
  return (
    <div className="space-y-6">
      {/* Summary metrics section */}
      <ContractSummarySection 
        contractData={contractData || []}
        isLoading={isLoading} 
        summaryData={summaryData}
      />
      
      {/* Charts for visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContractCharts 
          contractData={contractData || []}
          groupedContracts={groupedContracts}
          isLoading={isLoading}
        />
        
        {/* Contract expirations list */}
        <ContractExpiryList 
          sites={sitesData || []} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}

// Add the missing hook implementation
function useSites() {
  return useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/sites');
        if (!response.ok) {
          throw new Error('Failed to fetch sites');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching sites:', error);
        return [];
      }
    }
  });
}
