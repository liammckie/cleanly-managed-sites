
import { useQuery } from '@tanstack/react-query';
import { ContractSummaryData, ContractData } from '@/types/contracts';
import { ContractForecast } from '@/components/sites/forms/types/contractTypes';
import { formatCurrency } from '@/lib/utils/format';
import { fetchContracts } from '@/lib/api/contracts';
import { addMonths, addDays, format, parseISO, differenceInMonths } from 'date-fns';

export function useContractForecast() {
  const { data: contracts = [], isLoading: isLoadingContracts } = useQuery({
    queryKey: ['contracts'],
    queryFn: fetchContracts,
  });

  const summaryData: ContractSummaryData = { 
    totalCount: 0,
    activeCount: 0,
    pendingCount: 0,
    totalValue: 0,
    totalContracts: 0,
    expiringWithin30Days: 0, 
    expiringThisMonth: 0,
    expiringNext3Months: 0,
    expiringNext6Months: 0,
    expiringThisYear: 0,
    valueExpiringThisMonth: 0,
    valueExpiringNext3Months: 0,
    valueExpiringNext6Months: 0,
    valueExpiringThisYear: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    profitMargin: 0,
    avgContractValue: 0, // Added this field
    renewalRate: 0, // Added with default value
    expiringCount: 0 // Added with default value
  };
  
  const isLoadingSummary = false;

  // Generate forecast data
  const generateForecastData = (): ContractForecast[] => {
    if (!contracts || contracts.length === 0) return [];

    const today = new Date();
    const forecastMonths = 12; // Forecast for 12 months
    const forecast: ContractForecast[] = [];
    
    // Initialize monthly buckets for the forecast period
    for (let i = 0; i < forecastMonths; i++) {
      const month = addMonths(today, i);
      const forecastItem: ContractForecast = {
        month: format(month, 'MMM yyyy'),
        startDate: format(month, 'yyyy-MM-01'),
        endDate: format(addDays(addMonths(month, 1), -1), 'yyyy-MM-dd'),
        revenue: 0,
        cost: 0,
        profit: 0,
        value: 0
      };
      forecast.push(forecastItem);
    }
    
    // Allocate contract values to months
    contracts.forEach((contract: ContractData) => {
      // Skip if no start or end date
      if (!contract.startDate || !contract.endDate) {
        return;
      }
      
      const startDate = parseISO(contract.startDate);
      const endDate = parseISO(contract.endDate);
      
      // Skip expired contracts
      if (endDate < today) {
        return;
      }
      
      // Determine number of months this contract spans in our forecast period
      let contractStartInForecast = startDate > today ? startDate : today;
      let contractEndInForecast = endDate;
      
      // Calculate the value per month for this contract
      const monthlyValue = contract.value / Math.max(1, differenceInMonths(contractEndInForecast, contractStartInForecast));
      
      // Distribute the value across the forecast months
      forecast.forEach((forecastMonth) => {
        const forecastStart = parseISO(forecastMonth.startDate);
        const forecastEnd = parseISO(forecastMonth.endDate);
        
        // If contract is active in this forecast month
        if (
          (contractStartInForecast <= forecastEnd && contractEndInForecast >= forecastStart) ||
          (contractStartInForecast <= forecastStart && contractEndInForecast >= forecastEnd)
        ) {
          forecastMonth.value += monthlyValue;
          forecastMonth.revenue += monthlyValue;
          // Assume cost is 70% of revenue for simplicity
          forecastMonth.cost += monthlyValue * 0.7;
          forecastMonth.profit += monthlyValue * 0.3;
        }
      });
    });
    
    return forecast;
  };
  
  // Generate forecast data when contracts change
  const forecastData = generateForecastData();
  
  // Calculate summary metrics
  const calculateSummary = () => {
    // Use the provided summary data as a base
    const summary = { ...summaryData };
    
    // Calculate additional metrics if needed
    summary.totalCount = contracts.length;
    summary.activeCount = contracts.filter(c => c.status === 'active').length;
    
    // Calculate average contract value
    if (contracts.length > 0) {
      const totalValue = contracts.reduce((sum, contract) => sum + (contract.value || 0), 0);
      summary.avgContractValue = totalValue / contracts.length;
    }
    
    return summary;
  };
  
  return {
    forecastData,
    summaryData: calculateSummary(),
    isLoading: isLoadingContracts || isLoadingSummary
  };
}
