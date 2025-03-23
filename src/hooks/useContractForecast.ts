import { useQuery } from '@tanstack/react-query';
import { ContractForecast, ContractSummary } from '@/components/sites/forms/types/contractTypes';

export const useContractForecast = () => {
  // Get the current year and the next year
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  // Create an array of month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Create an object to hold the total value for each month
  const totalForMonth: { [key: string]: number } = {};
  const revenue: { [key: string]: number } = {};
  const cost: { [key: string]: number } = {};
  const profit: { [key: string]: number } = {};
  const dates: { [key: string]: Date } = {};

  // Fetch contract forecast
  const { data: forecastData, isLoading: isForecastLoading } = useQuery({
    queryKey: ['contractForecast'],
    queryFn: async (): Promise<ContractForecast[]> => {
      try {
        // Simulate contract data for the current and next year
        const contractData = [
          { month: 'January', year: currentYear, value: 1000, revenue: 600, cost: 400 },
          { month: 'February', year: currentYear, value: 1100, revenue: 650, cost: 450 },
          { month: 'March', year: currentYear, value: 1200, revenue: 700, cost: 500 },
          { month: 'April', year: currentYear, value: 1300, revenue: 750, cost: 550 },
          { month: 'May', year: currentYear, value: 1400, revenue: 800, cost: 600 },
          { month: 'June', year: currentYear, value: 1500, revenue: 850, cost: 650 },
          { month: 'July', year: currentYear, value: 1600, revenue: 900, cost: 700 },
          { month: 'August', year: currentYear, value: 1700, revenue: 950, cost: 750 },
          { month: 'September', year: currentYear, value: 1800, revenue: 1000, cost: 800 },
          { month: 'October', year: currentYear, value: 1900, revenue: 1050, cost: 850 },
          { month: 'November', year: currentYear, value: 2000, revenue: 1100, cost: 900 },
          { month: 'December', year: currentYear, value: 2100, revenue: 1150, cost: 950 },
          { month: 'January', year: nextYear, value: 2200, revenue: 1200, cost: 1000 },
          { month: 'February', year: nextYear, value: 2300, revenue: 1250, cost: 1050 },
          { month: 'March', year: nextYear, value: 2400, revenue: 1300, cost: 1100 },
          { month: 'April', year: nextYear, value: 2500, revenue: 1350, cost: 1150 },
          { month: 'May', year: nextYear, value: 2600, revenue: 1400, cost: 1200 },
          { month: 'June', year: nextYear, value: 2700, revenue: 1450, cost: 1250 },
          { month: 'July', year: nextYear, value: 2800, revenue: 1500, cost: 1300 },
          { month: 'August', year: nextYear, value: 2900, revenue: 1550, cost: 1350 },
          { month: 'September', year: nextYear, value: 3000, revenue: 1600, cost: 1400 },
          { month: 'October', year: nextYear, value: 3100, revenue: 1650, cost: 1450 },
          { month: 'November', year: nextYear, value: 3200, revenue: 1700, cost: 1500 },
          { month: 'December', year: nextYear, value: 3300, revenue: 1750, cost: 1550 },
        ];

        // Calculate the total value for each month
        contractData.forEach(item => {
          const month = item.month;
          totalForMonth[month] = (totalForMonth[month] || 0) + item.value;
          revenue[month] = (revenue[month] || 0) + item.revenue;
          cost[month] = (cost[month] || 0) + item.cost;
          profit[month] = (profit[month] || 0) + (item.revenue - item.cost);
          dates[month] = new Date(item.year, months.indexOf(month), 1);
        });

        // Transform the data to the required format
        return months.map(month => ({
          month: month,
          value: Math.round(totalForMonth[month] || 0),
          revenue: Math.round(revenue[month] || 0),
          cost: Math.round(cost[month] || 0),
          profit: Math.round(profit[month] || 0),
          date: dates[month]
        }));
      } catch (error) {
        console.error('Error fetching contract forecast:', error);
        return [];
      }
    }
  });

  // Fetch contract summary
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['contractSummary'],
    queryFn: async (): Promise<ContractSummary> => {
      try {
        // Simulate contract summary data
        const totalValue = 50000;
        const activeCount = 15;
        const expiringCount = 3;
        const averageValue = totalValue / activeCount;
        const expiring30Days = 1;
        const expiring90Days = 2;
        const avgContractLength = 36;
        const renewalRate = 0.85;
        
        return {
          totalValue: totalValue,
          activeContracts: activeCount,
          expiringContracts: expiringCount,
          avgContractValue: averageValue,
          expiringWithin30Days: expiring30Days,
          expiringWithin90Days: expiring90Days,
          averageContractLength: avgContractLength,
          renewalRate: renewalRate
        };
      } catch (error) {
        console.error('Error fetching contract summary:', error);
        return {
          totalValue: 0,
          activeContracts: 0,
          expiringContracts: 0,
          avgContractValue: 0,
          expiringWithin30Days: 0,
          expiringWithin90Days: 0
        };
      }
    }
  });

  return {
    forecastData,
    summaryData,
    isForecastLoading,
    isSummaryLoading
  };
};
