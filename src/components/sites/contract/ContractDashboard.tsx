
import React from 'react';
import { useContracts } from '@/hooks/useContracts';
import { ContractSummarySection } from './ContractSummarySection';
import { ContractCharts } from './ContractCharts';
import { ContractExpiryList } from './ContractExpiryList'; 
import { useContractForecast } from '@/hooks/useContractForecast';
import { useSites } from '@/hooks/useSites';

/**
 * Dashboard component for contract management
 * Displays summary metrics, charts, and upcoming expirations
 */
export function ContractDashboard() {
  const { contractData, groupedContracts, isLoading } = useContracts();
  const { sites } = useSites();
  const { forecastData, summaryData } = useContractForecast(sites || []);
  
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
          forecastData={forecastData} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
