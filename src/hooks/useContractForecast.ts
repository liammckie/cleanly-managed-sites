
import { useState, useEffect } from 'react';
import { ContractForecast, ContractSummary } from '@/components/sites/forms/types/contractTypes';

export const useContractForecast = (siteId?: string) => {
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
      if (!siteId) return;
      
      setIsForecastLoading(true);
      // Fetch forecast data logic would go here
      // For now, using mock data
      const mockForecast = generateMockForecastData();
      setForecastData(mockForecast);
      setIsForecastLoading(false);
    };

    const fetchSummaryData = async () => {
      if (!siteId) return;
      
      setIsSummaryLoading(true);
      // Fetch summary data logic would go here
      // For now, using mock data
      const mockSummary = generateMockSummaryData();
      setSummaryData(mockSummary);
      setIsSummaryLoading(false);
    };

    fetchForecastData();
    fetchSummaryData();
  }, [siteId]);

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
      renewalRate: Math.random() * 0.3 + 0.6
    };
  };

  return { 
    forecastData, 
    summaryData, 
    isForecastLoading, 
    isSummaryLoading 
  };
};
