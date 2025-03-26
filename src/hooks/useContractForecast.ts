import { useQuery } from '@tanstack/react-query';
import { SiteRecord } from '@/lib/types';
import { ContractForecast } from '@/components/sites/forms/types/contractTypes';
import { asJsonObject, jsonToString } from '@/lib/utils/json';

/**
 * Generate contract forecast data from site data
 */
export function useContractForecast() {
  const query = useQuery({
    queryKey: ['contract-forecast'],
    queryFn: async () => {
      try {
        // Fetch sites data
        const response = await fetch('/api/sites');
        const sites = await response.json() as SiteRecord[];
        
        return calculateForecast(sites);
      } catch (error) {
        console.error('Error generating contract forecast:', error);
        throw error;
      }
    }
  });

  return query;
}

/**
 * Calculate forecast data from sites
 */
function calculateForecast(sites: SiteRecord[]) {
  const forecast: ContractForecast[] = [];
  let totalRevenue = 0;
  let totalCost = 0;
  let totalProfit = 0;
  let sitesWithValidContracts = 0;

  // Process each site
  sites.forEach(site => {
    const details = asJsonObject(site.contract_details, {});
    const contractStart = details.startDate ? new Date(details.startDate) : null;
    const contractEnd = details.endDate ? new Date(details.endDate) : null;
    
    // Skip sites without contract dates
    if (!contractStart || !contractEnd) return;
    
    sitesWithValidContracts++;
    
    // Calculate financial metrics
    const monthlyRevenue = site.monthly_revenue || 0;
    const monthlyCost = site.monthly_cost || 0;
    const monthlyProfit = monthlyRevenue - monthlyCost;
    
    totalRevenue += monthlyRevenue;
    totalCost += monthlyCost;
    totalProfit += monthlyProfit;
    
    // Generate monthly forecast (simplified)
    const startMonth = contractStart.getMonth();
    const endMonth = contractEnd.getMonth();
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i <= 11; i++) {
      const monthDate = new Date(currentYear, i, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      
      // If this month is within the contract period
      if (i >= startMonth && i <= endMonth) {
        const existingEntry = forecast.find(entry => entry.month === monthName);
        
        if (existingEntry) {
          existingEntry.revenue += monthlyRevenue;
          existingEntry.cost += monthlyCost;
          existingEntry.profit += monthlyProfit;
        } else {
          forecast.push({
            month: monthName,
            revenue: monthlyRevenue,
            cost: monthlyCost,
            profit: monthlyProfit
          });
        }
      }
    }
  });
  
  // Sort forecast by month
  forecast.sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });
  
  // Return forecast and summary data
  return {
    forecast,
    summaryData: {
      totalRevenue,
      totalCost,
      totalProfit,
      avgContractValue: sitesWithValidContracts > 0 ? totalRevenue / sitesWithValidContracts : 0,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    },
    hasValidContract: sitesWithValidContracts.toString()
  };
}
