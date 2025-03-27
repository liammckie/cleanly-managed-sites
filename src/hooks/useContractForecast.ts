
import { useState, useEffect } from 'react';
import { useContracts } from './useContracts';
import { ContractSummaryData } from '@/lib/types/contracts';
import { awardData } from '@/lib/award/awardData';

// Local interface definition to avoid circular dependencies
interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export function useContractForecast() {
  const { contractData, metrics } = useContracts();
  const [forecastData, setForecastData] = useState<ContractForecast[]>([]);
  
  const [summaryData, setSummaryData] = useState<ContractSummaryData>({
    expiringThisMonth: 0,
    expiringNext3Months: 0,
    expiringNext6Months: 0,
    expiringThisYear: 0,
    valueExpiringThisMonth: 0,
    valueExpiringNext3Months: 0,
    valueExpiringNext6Months: 0,
    valueExpiringThisYear: 0,
    activeCount: 0,
    totalValue: 0,
    totalCount: 0,
    pendingCount: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    avgContractValue: 0,
    profitMargin: 0
  });
  
  useEffect(() => {
    if (contractData && contractData.length > 0) {
      // Generate forecast data
      const months = 12;
      const forecast: ContractForecast[] = [];
      const currentDate = new Date();
      
      // Metrics for contract summary
      let expiringThisMonth = 0;
      let expiringNext3Months = 0;
      let expiringNext6Months = 0;
      let expiringThisYear = 0;
      let valueExpiringThisMonth = 0;
      let valueExpiringNext3Months = 0;
      let valueExpiringNext6Months = 0;
      let valueExpiringThisYear = 0;
      let activeCount = 0;
      let totalValue = 0;
      
      // Initialize forecast months
      for (let i = 0; i < months; i++) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() + i);
        forecast.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: 0,
          cost: 0,
          profit: 0
        });
      }
      
      // Calculate forecast and metrics
      contractData.forEach(contract => {
        const monthlyRevenue = contract.monthly_revenue || 0;
        totalValue += monthlyRevenue * 12; // Annual value
        
        if (contract.status === 'active') {
          activeCount++;
          
          // Handle contract expiry
          let endDate: Date | null = null;
          
          // Safely extract contract details and endDate
          if (contract.contract_details && typeof contract.contract_details === 'object') {
            const details = contract.contract_details as any;
            if (details.endDate) {
              endDate = new Date(details.endDate);
            }
          }
          
          if (endDate) {
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            const expiryMonth = endDate.getMonth();
            const expiryYear = endDate.getFullYear();
            
            // Check if contract expires this month
            if (expiryMonth === currentMonth && expiryYear === currentYear) {
              expiringThisMonth++;
              valueExpiringThisMonth += monthlyRevenue * 12;
            }
            
            // Check if contract expires in the next 3 months
            const threeMonthsLater = new Date(currentDate);
            threeMonthsLater.setMonth(currentDate.getMonth() + 3);
            if (endDate <= threeMonthsLater) {
              expiringNext3Months++;
              valueExpiringNext3Months += monthlyRevenue * 12;
            }
            
            // Check if contract expires in the next 6 months
            const sixMonthsLater = new Date(currentDate);
            sixMonthsLater.setMonth(currentDate.getMonth() + 6);
            if (endDate <= sixMonthsLater) {
              expiringNext6Months++;
              valueExpiringNext6Months += monthlyRevenue * 12;
            }
            
            // Check if contract expires this year
            if (expiryYear === currentYear) {
              expiringThisYear++;
              valueExpiringThisYear += monthlyRevenue * 12;
            }
            
            // Add contract revenue to forecast until expiry
            for (let i = 0; i < months; i++) {
              const forecastDate = new Date(currentDate);
              forecastDate.setMonth(currentDate.getMonth() + i);
              if (forecastDate <= endDate) {
                const monthIndex = i;
                if (monthIndex < forecast.length) {
                  forecast[monthIndex].revenue += monthlyRevenue;
                  // Assuming cost is 70% of revenue for demonstration
                  const cost = monthlyRevenue * 0.7;
                  forecast[monthIndex].cost += cost;
                  forecast[monthIndex].profit += (monthlyRevenue - cost);
                }
              }
            }
          } else {
            // If no end date, assume contract continues for the entire forecast period
            for (let i = 0; i < months; i++) {
              const monthIndex = i;
              if (monthIndex < forecast.length) {
                forecast[monthIndex].revenue += monthlyRevenue;
                // Assuming cost is 70% of revenue for demonstration
                const cost = monthlyRevenue * 0.7;
                forecast[monthIndex].cost += cost;
                forecast[monthIndex].profit += (monthlyRevenue - cost);
              }
            }
          }
        }
      });
      
      // Calculate derived metrics
      const totalRevenue = totalValue;
      const totalCost = totalRevenue * 0.7; // Assuming 70% cost
      const totalProfit = totalRevenue - totalCost;
      const avgContractValue = activeCount > 0 ? totalValue / activeCount : 0;
      const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
      
      // Update state
      setForecastData(forecast);
      setSummaryData({
        expiringThisMonth,
        expiringNext3Months,
        expiringNext6Months,
        expiringThisYear,
        valueExpiringThisMonth,
        valueExpiringNext3Months,
        valueExpiringNext6Months,
        valueExpiringThisYear,
        activeCount,
        totalValue,
        totalCount: contractData.length,
        totalRevenue,
        totalCost,
        totalProfit,
        avgContractValue,
        profitMargin,
        pendingCount: contractData.filter(c => c.status === 'pending').length,
      });
    }
  }, [contractData]);
  
  return { forecastData, summaryData };
}
