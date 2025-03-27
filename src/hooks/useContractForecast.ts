
import { useQuery } from '@tanstack/react-query';
import { ContractForecast } from '@/types/contracts';
import { contractsApi } from '@/lib/api/contracts';
import { format, addMonths, startOfMonth } from 'date-fns';

interface UseContractForecastResult {
  forecasts: ContractForecast[];
  loaded: boolean;
  error: any;
}

const calculateProjectedRevenue = (month: Date): number => {
  // Sample calculation logic, will need to be replaced with actual data
  const baseAmount = 10000;
  const growth = 0.02;
  const currentMonth = new Date().getMonth();
  const monthDiff = (month.getMonth() - currentMonth + 12) % 12;
  
  return baseAmount * (1 + growth * monthDiff);
};

// Generate sample forecast data for 12 months
const generateForecastData = (): ContractForecast[] => {
  const forecasts: ContractForecast[] = [];
  const startMonth = startOfMonth(new Date());
  
  for (let i = 0; i < 12; i++) {
    const month = addMonths(startMonth, i);
    const revenue = calculateProjectedRevenue(month);
    const cost = revenue * 0.7; // Assuming 70% cost
    const profit = revenue * 0.3; // Assuming 30% profit
    
    forecasts.push({
      month: format(month, 'MMM yyyy'),
      revenue,
      cost,
      profit,
      contractCount: Math.floor(revenue / 2000), // Sample calculation
      activeContracts: Math.floor(revenue / 2500), // Sample calculation
      expiringContracts: Math.floor(revenue / 25000), // Sample calculation
      renewingContracts: Math.floor(revenue / 30000), // Sample calculation
    });
  }
  
  return forecasts;
};

export function useContractForecast(): UseContractForecastResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contract-forecast'],
    queryFn: async () => {
      try {
        // Try to fetch from API first
        const data = await contractsApi.getContractForecast();
        return data;
      } catch (e) {
        // Fallback to generated data if API fails
        console.warn('Failed to fetch contract forecast, using sample data', e);
        return generateForecastData();
      }
    },
    meta: {
      errorMessage: 'Failed to fetch contract forecast data'
    }
  });
  
  return {
    forecasts: data || [],
    loaded: !isLoading,
    error
  };
}
