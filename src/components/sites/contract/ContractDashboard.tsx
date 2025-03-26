
import React from 'react';
import { useContracts } from '@/hooks/useContracts';
import { ContractSummarySection } from './ContractSummarySection';
import { ContractCharts } from './ContractCharts';
import { ContractExpiryList } from './ContractExpiryList'; 
import { useContractForecast } from '@/hooks/useContractForecast';
import { useAsyncData } from '@/hooks/useAsyncData';
import { SiteRecord } from '@/lib/types';

/**
 * Dashboard component for contract management
 * Displays summary metrics, charts, and upcoming expirations
 */
export function ContractDashboard() {
  const { contractData, groupedContracts, isLoading } = useContracts();
  const { data: sitesData } = useSites();
  const { data: sites } = useAsyncData<SiteRecord[]>(sitesData || []);
  const { data: forecastData } = useContractForecast();
  
  return (
    <div className="space-y-6">
      {/* Summary metrics section */}
      <ContractSummarySection 
        contractData={contractData || []} 
        isLoading={isLoading} 
        summaryData={forecastData?.summaryData || {}}
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
          sites={sites || []} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}

// Add the missing hook import
function useSites() {
  return useQuery({
    queryKey: ['sites'],
    queryFn: () => fetch('/api/sites').then(res => res.json())
  });
}
