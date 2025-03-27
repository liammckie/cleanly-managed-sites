
import { useState, useEffect } from 'react';
import { useContracts } from './useContracts';
import { ContractForecast } from '@/components/sites/forms/types/contractTypes';
import { ContractSummaryData } from '@/lib/types/contracts';
import { asJsonObject } from '@/lib/utils/json';
import { addMonths, format } from 'date-fns';

export function useContractForecast() {
  const { contracts } = useContracts();
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
    totalContracts: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    avgContractValue: 0,
    profitMargin: 0,
    totalCount: 0,
    pendingCount: 0,
  });
  
  useEffect(() => {
    if (contracts.length > 0) {
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
        const date = addMonths(currentDate, i);
        forecast.push({
          month: format(date, 'MMM yyyy'),
          revenue: 0,
          cost: 0,
          profit: 0
        });
      }
      
      // Calculate forecast and metrics
      contracts.forEach(contract => {
        const monthlyRevenue = contract.monthly_revenue || 0;
        totalValue += monthlyRevenue * 12; // Annual value
        
        if (contract.status === 'active') {
          activeCount++;
          
          // Get contract details as an object
          const contractDetails = asJsonObject(contract.contract_details, {});
          
          // Handle contract expiry
          const endDateStr = contractDetails.endDate;
          if (endDateStr) {
            const endDate = new Date(endDateStr);
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
            const threeMonthsLater = addMonths(currentDate, 3);
            if (endDate <= threeMonthsLater) {
              expiringNext3Months++;
              valueExpiringNext3Months += monthlyRevenue * 12;
            }
            
            // Check if contract expires in the next 6 months
            const sixMonthsLater = addMonths(currentDate, 6);
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
              const forecastDate = addMonths(currentDate, i);
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
        totalContracts: contracts.length,
        totalRevenue,
        totalCost,
        totalProfit,
        avgContractValue,
        profitMargin,
        totalCount: contracts.length,
        pendingCount: contracts.filter(c => c.status === 'pending').length,
      });
    }
  }, [contracts]);
  
  return { forecastData, summaryData };
}
