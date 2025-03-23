
import { useState, useEffect } from 'react';
import { ContractForecast, ContractSummary } from '@/components/sites/forms/types/contractTypes';
import { SiteRecord } from '@/lib/types';

export const useContractForecast = (siteIdOrSites?: string | SiteRecord[]) => {
  const [forecastData, setForecastData] = useState<ContractForecast[]>([]);
  const [summaryData, setSummaryData] = useState<ContractSummary>({
    totalValue: 0,
    activeContracts: 0,
    expiringContracts: 0,
    avgContractValue: 0
  });
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  useEffect(() => {
    const fetchForecastData = async () => {
      let siteId: string | undefined;
      
      if (typeof siteIdOrSites === 'string') {
        siteId = siteIdOrSites;
      } else if (Array.isArray(siteIdOrSites) && siteIdOrSites.length > 0) {
        // Use the first site's ID as a reference or handle aggregated data
        siteId = siteIdOrSites[0]?.id;
      }
      
      // Only proceed if we have a siteId or sites array
      if (!siteId && !Array.isArray(siteIdOrSites)) return;
      
      setIsForecastLoading(true);
      // Fetch forecast data logic would go here
      // For now, using mock data
      const mockForecast = generateMockForecastData();
      setForecastData(mockForecast);
      setIsForecastLoading(false);
    };

    const fetchSummaryData = async () => {
      setIsSummaryLoading(true);
      
      // Generate a base summary with default values
      const mockSummary = generateMockSummaryData();
      
      // If sites array is provided, calculate aggregate values
      if (Array.isArray(siteIdOrSites) && siteIdOrSites.length > 0) {
        mockSummary.activeContracts = siteIdOrSites.length;
        
        // Count expiring contracts
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(today.getDate() + 90);
        
        let expiringWithin30Days = 0;
        let expiringWithin90Days = 0;
        
        siteIdOrSites.forEach(site => {
          const endDateStr = site.contract_details?.endDate;
          if (endDateStr) {
            const endDate = new Date(endDateStr);
            if (endDate <= thirtyDaysFromNow) {
              expiringWithin30Days++;
            } else if (endDate <= ninetyDaysFromNow) {
              expiringWithin90Days++;
            }
          }
        });
        
        mockSummary.expiringWithin30Days = expiringWithin30Days;
        mockSummary.expiringWithin90Days = expiringWithin90Days;
        mockSummary.expiringContracts = expiringWithin30Days + expiringWithin90Days;
        
        // Calculate aggregate contract value
        mockSummary.totalValue = siteIdOrSites.reduce((sum, site) => {
          const value = site.contract_details?.value || site.monthly_revenue || 0;
          return sum + value;
        }, 0);
        
        mockSummary.avgContractValue = mockSummary.totalValue / Math.max(1, siteIdOrSites.length);
      } else if (typeof siteIdOrSites === 'string') {
        // If a single siteId is provided, we'd fetch data for that site
        // For now we'll just use the mock data
      } else {
        // If no sites are provided, we'll use the default mock data
      }
      
      setSummaryData(mockSummary);
      setIsSummaryLoading(false);
    };

    fetchForecastData();
    fetchSummaryData();
  }, [siteIdOrSites]);

  // Mock data generation for development
  const generateMockForecastData = (): ContractForecast[] => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return months.map((month, index) => ({
      month,
      value: Math.floor(Math.random() * 10000) + 5000,
      revenue: Math.floor(Math.random() * 8000) + 4000,
      cost: Math.floor(Math.random() * 3000) + 1000,
      profit: Math.floor(Math.random() * 5000) + 2000,
      date: new Date(2023, index, 1)
    }));
  };

  const generateMockSummaryData = (): ContractSummary => {
    return {
      totalValue: Math.floor(Math.random() * 500000) + 100000,
      activeContracts: Math.floor(Math.random() * 50) + 10,
      expiringContracts: Math.floor(Math.random() * 10) + 1,
      avgContractValue: Math.floor(Math.random() * 20000) + 5000,
      expiringWithin30Days: Math.floor(Math.random() * 5) + 1,
      expiringWithin90Days: Math.floor(Math.random() * 10) + 5,
      averageContractLength: Math.floor(Math.random() * 24) + 6,
      renewalRate: Math.floor((Math.random() * 30) + 60) // Convert to percentage value
    };
  };

  return { 
    forecastData, 
    summaryData, 
    isForecastLoading, 
    isSummaryLoading,
    // Add these aliases to maintain backward compatibility
    forecast: forecastData,
    summary: summaryData
  };
};
