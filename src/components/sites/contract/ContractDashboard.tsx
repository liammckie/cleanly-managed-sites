
import React from 'react';
import { useContracts } from '@/hooks/useContracts';
import { ContractSummarySection } from './ContractSummarySection';
import { ContractCharts } from './ContractCharts';
import { ContractExpiryList } from './ContractExpiryList'; 
import { useContractForecast } from '@/hooks/useContractForecast';
import { useSites } from '@/hooks/useSites';
import { useAsyncData } from '@/hooks/useAsyncData';
import { SiteRecord } from '@/lib/types';

/**
 * Dashboard component for contract management
 * Displays summary metrics, charts, and upcoming expirations
 */
export function ContractDashboard() {
  const { contractData, groupedContracts, isLoading } = useContracts();
  const { data: sitesData } = useSites();
  const { data: sites } = useAsyncData(sitesData || []);
  const { forecastData, summaryData } = useContractForecast(sites as SiteRecord[]);
  
  return (
    <div className="space-y-6">
      {/* Summary metrics section */}
      <ContractSummarySection 
        contractData={contractData} 
        isLoading={isLoading} 
        summaryData={summaryData}
      />
      
      {/* Charts for visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContractCharts 
          contractData={contractData} 
          groupedContracts={groupedContracts}
          isLoading={isLoading}
        />
        
        {/* Contract expirations list */}
        <ContractExpiryList 
          sites={sites as SiteRecord[]} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
