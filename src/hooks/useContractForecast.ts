
import { useState, useEffect } from 'react';
import { useContracts } from './useContracts';
import { ContractForecast } from '@/types/contracts';
import { add, format, parseISO, differenceInMonths } from 'date-fns';

export function useContractForecast() {
  const { contractData, metrics, isLoading } = useContracts();
  const [forecastData, setForecastData] = useState<ContractForecast[]>([]);
  
  // Make sure metrics has default values for missing properties
  const enhancedMetrics = {
    totalCount: metrics?.totalCount || 0,
    activeCount: metrics?.activeCount || 0,
    totalValue: metrics?.totalValue || 0,
    pendingCount: metrics?.pendingCount || 0,
    
    // Set defaults for expiry metrics if they don't exist
    expiringWithin30Days: metrics?.expiringWithin30Days || 0,
    expiringThisMonth: metrics?.expiringThisMonth || 0,
    expiringNext3Months: metrics?.expiringNext3Months || 0,
    expiringNext6Months: metrics?.expiringNext6Months || 0,
    expiringThisYear: metrics?.expiringThisYear || 0,
    
    // Set defaults for value expiry metrics if they don't exist
    valueExpiringThisMonth: metrics?.valueExpiringThisMonth || 0,
    valueExpiringNext3Months: metrics?.valueExpiringNext3Months || 0,
    valueExpiringNext6Months: metrics?.valueExpiringNext6Months || 0,
    valueExpiringThisYear: metrics?.valueExpiringThisYear || 0,
    
    // Totals
    totalContracts: metrics?.totalCount || 0,
    totalRevenue: metrics?.totalValue || 0,
    totalCost: metrics?.totalValue ? metrics.totalValue * 0.7 : 0,
    totalProfit: metrics?.totalValue ? metrics.totalValue * 0.3 : 0,
    profitMargin: 30
  };
  
  // Generate forecast data from contract expiries
  useEffect(() => {
    if (!contractData || !Array.isArray(contractData)) {
      setForecastData([]);
      return;
    }
    
    const forecast: ContractForecast[] = [];
    
    // Project revenue for next 12 months
    for (let i = 0; i < 12; i++) {
      const date = add(new Date(), { months: i });
      const monthLabel = format(date, 'yyyy-MM');
      const endOfMonth = format(add(date, { months: 1, days: -1 }), 'yyyy-MM-dd');
      
      // Calculate how many contracts are active in this month
      const activeInMonth = contractData.filter(contract => {
        const start = contract.startDate || contract.start_date;
        const end = contract.endDate || contract.end_date;
        
        if (!start || !end) return false;
        
        try {
          const startDate = parseISO(start);
          const endDate = parseISO(end);
          const currentDate = date;
          
          return (startDate <= currentDate && endDate >= currentDate);
        } catch (e) {
          return false;
        }
      });
      
      // Calculate how many contracts expire in this month
      const expiringInMonth = contractData.filter(contract => {
        const end = contract.endDate || contract.end_date;
        if (!end) return false;
        
        try {
          const endDate = parseISO(end);
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          
          return (endDate >= monthStart && endDate <= monthEnd);
        } catch (e) {
          return false;
        }
      });
      
      // Calculate total value for this month
      const value = activeInMonth.reduce((total, contract) => {
        return total + (contract.value || contract.monthly_revenue || 0);
      }, 0);
      
      // Calculate at-risk value for this month
      const riskValue = expiringInMonth.reduce((total, contract) => {
        return total + (contract.value || contract.monthly_revenue || 0);
      }, 0);
      
      forecast.push({
        id: `forecast-${i}`,
        startDate: format(date, 'yyyy-MM-dd'),
        endDate: endOfMonth,
        value,
        riskValue,
        expiringCount: expiringInMonth.length,
        activeCount: activeInMonth.length,
        month: monthLabel
      } as unknown as ContractForecast);
    }
    
    setForecastData(forecast);
  }, [contractData]);
  
  return {
    forecastData,
    summaryData: enhancedMetrics,
    isLoading
  };
}

// Helper function to make TypeScript happy when accessing object properties
function getPropertySafely(obj: object, prop: string, defaultValue: any = null) {
  if (!obj) return defaultValue;
  
  // Use type assertions to access properties that might not exist
  const typedObj = obj as Record<string, any>;
  
  if (prop in typedObj) {
    return typedObj[prop];
  }
  
  // Convert from camelCase to snake_case and try again
  const snakeCase = prop.replace(/([A-Z])/g, '_$1').toLowerCase();
  if (snakeCase in typedObj) {
    return typedObj[snakeCase];
  }
  
  return defaultValue;
}
