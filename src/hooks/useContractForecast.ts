
import { useState, useEffect } from 'react';
import { ContractData } from '@/lib/types/contracts';
import { ContractForecast } from '@/components/sites/forms/types/contractTypes';
import { ContractSummaryData } from '@/lib/types/contracts';
import { asJsonObject } from '@/lib/utils/json';
import { endOfMonth, differenceInMonths, addMonths, format, isFuture, isAfter } from 'date-fns';

export const useContractForecast = (contracts: ContractData[]) => {
  const [forecastData, setForecastData] = useState<ContractForecast[]>([]);
  const [summaryData, setSummaryData] = useState<ContractSummaryData>({
    totalCount: 0,
    activeCount: 0,
    pendingCount: 0,
    expiringCount: 0,
    expiringThisMonth: 0,
    expiringNext3Months: 0,
    expiringNext6Months: 0,
    expiringThisYear: 0,
    valueExpiringThisMonth: 0,
    valueExpiringNext3Months: 0,
    valueExpiringNext6Months: 0,
    valueExpiringThisYear: 0,
    totalValue: 0,
    activeValue: 0,
    averageValue: 0,
    profitMargin: 0
  });

  useEffect(() => {
    if (!contracts || contracts.length === 0) return;

    const forecast: Record<string, ContractForecast> = {};
    const today = new Date();
    const threeMonthsLater = addMonths(today, 3);
    const sixMonthsLater = addMonths(today, 6);
    const endOfYear = new Date(today.getFullYear(), 11, 31);

    let totalCount = contracts.length;
    let activeCount = 0;
    let pendingCount = 0;
    let expiringCount = 0;
    let expiringThisMonth = 0;
    let expiringNext3Months = 0;
    let expiringNext6Months = 0;
    let expiringThisYear = 0;
    let totalValue = 0;
    let activeValue = 0;
    let valueExpiringThisMonth = 0;
    let valueExpiringNext3Months = 0;
    let valueExpiringNext6Months = 0;
    let valueExpiringThisYear = 0;

    // Initialize forecast data for the next 12 months
    for (let i = 0; i < 12; i++) {
      const forecastMonth = addMonths(today, i);
      const monthKey = format(forecastMonth, 'yyyy-MM');
      const displayMonth = format(forecastMonth, 'MMM yyyy');
      
      forecast[monthKey] = {
        month: displayMonth,
        revenue: 0,
        cost: 0,
        profit: 0
      };
    }

    // Process each contract
    contracts.forEach(contract => {
      const monthlyRevenue = contract.monthly_revenue || 0;
      totalValue += monthlyRevenue * 12;
      const contractDetails = asJsonObject(contract.contract_details, {});

      if (contract.status.toLowerCase() === 'active') {
        activeCount++;
        activeValue += monthlyRevenue * 12;
      } else if (contract.status.toLowerCase() === 'pending') {
        pendingCount++;
      }

      // Check if contract is expiring
      const endDateStr = contractDetails.endDate as string;
      if (endDateStr) {
        const endDate = new Date(endDateStr);
        
        if (isFuture(endDate)) {
          const endMonth = format(endDate, 'yyyy-MM');
          const monthsUntilExpiry = differenceInMonths(endDate, today);
          
          // Count expirations
          expiringCount++;
          
          if (monthsUntilExpiry === 0) {
            expiringThisMonth++;
            valueExpiringThisMonth += monthlyRevenue * 12;
          }
          
          if (isAfter(endDate, today) && isAfter(threeMonthsLater, endDate)) {
            expiringNext3Months++;
            valueExpiringNext3Months += monthlyRevenue * 12;
          }
          
          if (isAfter(endDate, today) && isAfter(sixMonthsLater, endDate)) {
            expiringNext6Months++;
            valueExpiringNext6Months += monthlyRevenue * 12;
          }
          
          if (isAfter(endDate, today) && isAfter(endOfYear, endDate)) {
            expiringThisYear++;
            valueExpiringThisYear += monthlyRevenue * 12;
          }
          
          // Add to forecast
          for (let i = 0; i < 12; i++) {
            const forecastMonth = addMonths(today, i);
            const monthKey = format(forecastMonth, 'yyyy-MM');
            
            if (isAfter(endDate, endOfMonth(forecastMonth)) || format(endDate, 'yyyy-MM') === monthKey) {
              forecast[monthKey].revenue += monthlyRevenue;
              // Assume cost is 70% of revenue for this example
              forecast[monthKey].cost += monthlyRevenue * 0.7;
              forecast[monthKey].profit += monthlyRevenue * 0.3;
            }
          }
        }
      }
    });

    const averageValue = activeCount > 0 ? activeValue / activeCount : 0;
    const profitMargin = totalValue > 0 ? (totalValue - totalValue * 0.7) / totalValue * 100 : 0;

    // Convert forecast object to array
    const forecastArray = Object.values(forecast);

    setForecastData(forecastArray);
    setSummaryData({
      totalCount,
      activeCount,
      pendingCount,
      expiringCount,
      expiringThisMonth,
      expiringNext3Months,
      expiringNext6Months,
      expiringThisYear,
      valueExpiringThisMonth,
      valueExpiringNext3Months,
      valueExpiringNext6Months,
      valueExpiringThisYear,
      totalValue,
      activeValue,
      averageValue,
      profitMargin
    });
  }, [contracts]);

  return { forecastData, summaryData };
};

export default useContractForecast;
