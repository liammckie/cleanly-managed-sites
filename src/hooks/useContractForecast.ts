
import { useState, useEffect } from 'react';
import { addMonths, format } from 'date-fns';
import { useContracts } from './useContracts';
import { ContractData, ContractForecast, ContractSummaryData } from '@/lib/types/contracts';

/**
 * Hook for generating contract forecast data
 * Shows contract value, costs, and profits over time
 */
export function useContractForecast(months: number = 12) {
  const [forecastData, setForecastData] = useState<{
    forecast: ContractForecast[],
    summaryData: ContractSummaryData
  } | null>(null);
  const { contractData, isLoading } = useContracts();

  useEffect(() => {
    if (!isLoading && contractData.length > 0) {
      generateForecast(contractData as ContractData[], months);
    }
  }, [isLoading, contractData, months]);

  /**
   * Generate monthly forecast based on contract data
   */
  const generateForecast = (contracts: ContractData[], monthCount: number) => {
    // Create forecast data for each month
    const forecast: ContractForecast[] = [];
    const now = new Date();
    
    // Pre-calculate contract expirations
    const expirations: Record<string, ContractData[]> = {};
    contracts.forEach(contract => {
      if (contract.contract_details?.endDate) {
        try {
          const endDate = new Date(contract.contract_details.endDate as string);
          const key = format(endDate, 'yyyy-MM');
          
          if (!expirations[key]) {
            expirations[key] = [];
          }
          expirations[key].push(contract);
        } catch (e) {
          // Skip invalid dates
        }
      }
    });
    
    // Calculate summary data (outside of monthly loop)
    const summaryData: ContractSummaryData = {
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
    
    // Initial total monthly value
    let currentMonthlyValue = 0;
    contracts.forEach(contract => {
      currentMonthlyValue += Number(contract.monthly_revenue) || 0;
    });
    
    // Generate month-by-month forecast
    for (let i = 0; i < monthCount; i++) {
      const forecastDate = addMonths(now, i);
      const monthKey = format(forecastDate, 'yyyy-MM');
      
      // Check for contract expirations this month
      const expiredContracts = expirations[monthKey] || [];
      let expiredValue = 0;
      
      expiredContracts.forEach(contract => {
        expiredValue += Number(contract.monthly_revenue) || 0;
      });
      
      // Update monthly revenue considering expirations
      currentMonthlyValue -= expiredValue;
      
      // Calculate cost as 70% of revenue (simplistic model)
      const monthlyCost = currentMonthlyValue * 0.7;
      const monthlyProfit = currentMonthlyValue - monthlyCost;
      
      // Add to forecast
      forecast.push({
        month: format(forecastDate, 'MMM yyyy'),
        revenue: currentMonthlyValue,
        cost: monthlyCost,
        profit: monthlyProfit
      });
      
      // Update 12-month totals for summary
      summaryData.totalRevenue += currentMonthlyValue;
      summaryData.totalCost += monthlyCost;
      summaryData.totalProfit += monthlyProfit;
    }
    
    // Annualized revenue (from first month)
    const annualizedRevenue = forecast[0]?.revenue * 12 || 0;
    summaryData.totalValue = annualizedRevenue;
    
    // Calculate average contract value
    if (summaryData.totalContracts > 0) {
      summaryData.avgContractValue = annualizedRevenue / summaryData.totalContracts;
    }
    
    // Calculate profit margin
    if (summaryData.totalRevenue > 0) {
      summaryData.profitMargin = (summaryData.totalProfit / summaryData.totalRevenue) * 100;
    }
    
    setForecastData({
      forecast,
      summaryData
    });
  };

  return {
    data: forecastData,
    isLoading
  };
}
