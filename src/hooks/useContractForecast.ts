
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
    const contractStartStr = details.startDate as string | undefined;
    const contractEndStr = details.endDate as string | undefined;
    
    const contractStart = contractStartStr ? new Date(contractStartStr) : null;
    const contractEnd = contractEndStr ? new Date(contractEndStr) : null;
    
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
  
  // Generate expiration metrics
  const now = new Date();
  const expiringThisMonth = countExpiringSites(sites, 0, 30);
  const expiringNext3Months = countExpiringSites(sites, 0, 90);
  const expiringNext6Months = countExpiringSites(sites, 0, 180);
  const expiringThisYear = countExpiringSites(sites, 0, 365);
  
  const valueExpiringThisMonth = calculateExpiringValue(sites, 0, 30);
  const valueExpiringNext3Months = calculateExpiringValue(sites, 0, 90);
  const valueExpiringNext6Months = calculateExpiringValue(sites, 0, 180);
  const valueExpiringThisYear = calculateExpiringValue(sites, 0, 365);
  
  // Return forecast and summary data
  return {
    forecast,
    summaryData: {
      totalRevenue,
      totalCost,
      totalProfit,
      avgContractValue: sitesWithValidContracts > 0 ? totalRevenue / sitesWithValidContracts : 0,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      expiringThisMonth,
      expiringNext3Months,
      expiringNext6Months,
      expiringThisYear,
      valueExpiringThisMonth,
      valueExpiringNext3Months,
      valueExpiringNext6Months,
      valueExpiringThisYear,
      totalContracts: sitesWithValidContracts
    },
    hasValidContract: sitesWithValidContracts.toString()
  };
}

/**
 * Count sites expiring within a date range
 */
function countExpiringSites(sites: SiteRecord[], minDays: number, maxDays: number): number {
  const now = new Date();
  return sites.filter(site => {
    const details = asJsonObject(site.contract_details, {});
    const endDateStr = details.endDate as string | undefined;
    if (!endDateStr) return false;
    
    const endDate = new Date(endDateStr);
    const daysUntilExpiry = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry >= minDays && daysUntilExpiry <= maxDays;
  }).length;
}

/**
 * Calculate total value of contracts expiring within a date range
 */
function calculateExpiringValue(sites: SiteRecord[], minDays: number, maxDays: number): number {
  const now = new Date();
  return sites
    .filter(site => {
      const details = asJsonObject(site.contract_details, {});
      const endDateStr = details.endDate as string | undefined;
      if (!endDateStr) return false;
      
      const endDate = new Date(endDateStr);
      const daysUntilExpiry = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry >= minDays && daysUntilExpiry <= maxDays;
    })
    .reduce((sum, site) => sum + (site.monthly_revenue || 0), 0);
}
