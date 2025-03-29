
import { useState, useEffect } from 'react';
import { ContractForecast } from '@/types/contracts';

export function useContractForecast() {
  const [forecastData, setForecastData] = useState<ContractForecast[]>([]);
  
  useEffect(() => {
    // Mock data for the chart
    const mockForecast: ContractForecast[] = [
      { month: 'Jan', revenue: 35000, cost: 25000, profit: 10000, contractCount: 12 },
      { month: 'Feb', revenue: 32000, cost: 24000, profit: 8000, contractCount: 12 },
      { month: 'Mar', revenue: 38000, cost: 26000, profit: 12000, contractCount: 13 },
      { month: 'Apr', revenue: 42000, cost: 28000, profit: 14000, contractCount: 14 },
      { month: 'May', revenue: 45000, cost: 30000, profit: 15000, contractCount: 14 },
      { month: 'Jun', revenue: 48000, cost: 32000, profit: 16000, contractCount: 15 },
      { month: 'Jul', revenue: 50000, cost: 33000, profit: 17000, contractCount: 16 },
      { month: 'Aug', revenue: 52000, cost: 34000, profit: 18000, contractCount: 17 },
      { month: 'Sep', revenue: 55000, cost: 36000, profit: 19000, contractCount: 18 },
      { month: 'Oct', revenue: 58000, cost: 38000, profit: 20000, contractCount: 19 },
      { month: 'Nov', revenue: 60000, cost: 39000, profit: 21000, contractCount: 20 },
      { month: 'Dec', revenue: 62000, cost: 40000, profit: 22000, contractCount: 22 }
    ];
    
    setForecastData(mockForecast);
  }, []);
  
  return {
    forecastData
  };
}
