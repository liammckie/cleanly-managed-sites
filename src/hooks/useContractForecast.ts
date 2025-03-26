
import { useQuery } from '@tanstack/react-query';
import { asJsonObject } from '@/lib/utils/json';
import { ContractForecast, ContractSummaryData } from '@/components/sites/contract/types';
import { ContractData } from '@/lib/types/contracts';
import { addMonths, format, parseISO, startOfMonth } from 'date-fns';
import { useContracts } from './useContracts';

interface ForecastData {
  forecasts: ContractForecast[];
  summaryData: ContractSummaryData;
}

export function useContractForecast() {
  const { contractData } = useContracts();

  return useQuery({
    queryKey: ['contractForecast'],
    queryFn: async () => calculateContractForecast(contractData || []),
    enabled: !!contractData && contractData.length > 0
  });
}

// Calculate contract forecasts and summary data
const calculateContractForecast = (contracts: ContractData[]): ForecastData => {
  const now = new Date();
  const thisMonth = startOfMonth(now);
  const in3Months = addMonths(thisMonth, 3);
  const in6Months = addMonths(thisMonth, 6);
  const in12Months = addMonths(thisMonth, 12);
  
  // Initialize summary counters
  const summary: ContractSummaryData = {
    expiringThisMonth: 0,
    expiringNext3Months: 0,
    expiringNext6Months: 0,
    expiringThisYear: 0,
    valueExpiringThisMonth: 0,
    valueExpiringNext3Months: 0,
    valueExpiringNext6Months: 0,
    valueExpiringThisYear: 0,
    totalContracts: contracts.length,
    totalValue: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    avgContractValue: 0,
    profitMargin: 0
  };
  
  const monthlyForecasts: Record<string, ContractForecast> = {};
  
  // Process each contract
  contracts.forEach(contract => {
    const details = asJsonObject(contract.contract_details, { startDate: '', endDate: '' });
    
    // Get contract dates
    const startDateStr = details.startDate as string;
    const endDateStr = details.endDate as string;
    
    // Skip contracts without valid dates
    if (!startDateStr || !endDateStr) return;
    
    try {
      const startDate = parseISO(startDateStr);
      const endDate = parseISO(endDateStr);
      const monthlyValue = contract.monthly_revenue || 0;
      
      // Add to total value
      summary.totalValue += monthlyValue * 12;
      summary.totalRevenue += monthlyValue * 12;
      
      // Check expiration timelines
      if (endDate <= in12Months) {
        summary.expiringThisYear++;
        summary.valueExpiringThisYear += monthlyValue * 12;
        
        if (endDate <= in6Months) {
          summary.expiringNext6Months++;
          summary.valueExpiringNext6Months += monthlyValue * 12;
          
          if (endDate <= in3Months) {
            summary.expiringNext3Months++;
            summary.valueExpiringNext3Months += monthlyValue * 12;
            
            if (endDate <= addMonths(thisMonth, 1)) {
              summary.expiringThisMonth++;
              summary.valueExpiringThisMonth += monthlyValue * 12;
            }
          }
        }
      }
      
      // Calculate and add to monthly forecasts
      let currentMonth = startOfMonth(startDate > thisMonth ? startDate : thisMonth);
      const endMonth = startOfMonth(endDate);
      
      while (currentMonth <= endMonth && currentMonth <= addMonths(thisMonth, 24)) {
        const monthKey = format(currentMonth, 'yyyy-MM');
        
        if (!monthlyForecasts[monthKey]) {
          monthlyForecasts[monthKey] = {
            month: format(currentMonth, 'MMM yyyy'),
            revenue: 0,
            cost: 0,
            profit: 0
          };
        }
        
        monthlyForecasts[monthKey].revenue += monthlyValue;
        monthlyForecasts[monthKey].profit += monthlyValue * 0.25; // Assumed profit margin
        
        currentMonth = addMonths(currentMonth, 1);
      }
    } catch (error) {
      console.error('Error processing contract dates:', error);
    }
  });
  
  // Calculate average contract value and profit margin
  if (contracts.length > 0) {
    summary.avgContractValue = summary.totalValue / contracts.length;
  }
  
  summary.totalProfit = summary.totalRevenue * 0.25; // Assumed profit margin
  summary.profitMargin = summary.totalRevenue > 0 ? (summary.totalProfit / summary.totalRevenue) * 100 : 0;
  
  // Convert forecasts object to array and sort by month
  const forecasts = Object.values(monthlyForecasts).sort((a, b) => {
    const monthA = parseISO(`${a.month.slice(-4)}-${a.month.slice(0, 3)}-01`);
    const monthB = parseISO(`${b.month.slice(-4)}-${b.month.slice(0, 3)}-01`);
    return monthA.getTime() - monthB.getTime();
  });
  
  return {
    forecasts,
    summaryData: summary
  };
};
