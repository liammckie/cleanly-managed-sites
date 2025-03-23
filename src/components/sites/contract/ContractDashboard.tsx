
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContractHistoryTable } from './ContractHistoryTable';
import { ContractSummaryCards } from './ContractSummaryCards';
import { ContractForecastChart } from './ContractForecastChart';
import { ContractExpiryList } from './ContractExpiryList';
import { SiteRecord } from '@/lib/types';
import { ContractHistoryEntry, ContractForecast, ContractSummary } from '../forms/types/contractTypes';
import { useContractHistory } from '@/hooks/useContractHistory';
import { useContractForecast } from '@/hooks/useContractForecast';

interface ContractDashboardProps {
  sites: SiteRecord[];
  isLoading: boolean;
}

export function ContractDashboard({ sites, isLoading }: ContractDashboardProps) {
  const [selectedSiteId, setSelectedSiteId] = React.useState<string | undefined>(
    sites?.length > 0 ? sites[0].id : undefined
  );
  
  const { history, isLoading: isLoadingHistory } = useContractHistory(selectedSiteId);
  const { forecast, summary, forecastData, summaryData } = useContractForecast(selectedSiteId);
  
  const selectedSite = useMemo(() => {
    return sites?.find(site => site.id === selectedSiteId);
  }, [sites, selectedSiteId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contract Management Dashboard</h1>
        <select 
          className="p-2 border rounded glass-input" 
          value={selectedSiteId}
          onChange={(e) => setSelectedSiteId(e.target.value)}
        >
          {sites?.map(site => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
      </div>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="history">Contract History</TabsTrigger>
          <TabsTrigger value="forecast">Financial Forecast</TabsTrigger>
          <TabsTrigger value="expiry">Expiring Contracts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <ContractSummaryCards summary={summary || summaryData} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          {selectedSite && (
            <ContractHistoryTable 
              history={history} 
              isLoading={isLoadingHistory} 
              currentContractDetails={selectedSite.contract_details}
            />
          )}
        </TabsContent>
        
        <TabsContent value="forecast" className="space-y-6">
          <ContractForecastChart forecast={forecast || forecastData} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="expiry" className="space-y-6">
          <ContractExpiryList sites={sites} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
