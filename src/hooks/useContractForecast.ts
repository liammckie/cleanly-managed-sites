
import { useQuery } from '@tanstack/react-query';
import { SiteRecord } from '@/lib/api';
import { asJsonObject, jsonToString } from '@/lib/utils/json';
import { ContractForecast } from '@/components/sites/forms/types/contractTypes';

function generateForecast(site: SiteRecord): ContractForecast[] {
  // Generate a 12-month forecast based on site revenue and cost
  const forecast: ContractForecast[] = [];
  const currentDate = new Date();
  
  const monthlyRevenue = site.monthly_revenue || 0;
  const monthlyCost = site.monthly_cost || 0;
  const profit = monthlyRevenue - monthlyCost;
  
  for (let i = 0; i < 12; i++) {
    const forecastDate = new Date(currentDate);
    forecastDate.setMonth(currentDate.getMonth() + i);
    
    const month = forecastDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    forecast.push({
      month,
      revenue: monthlyRevenue,
      cost: monthlyCost,
      profit
    });
  }
  
  return forecast;
}

export function useContractForecast(siteId: string) {
  return useQuery({
    queryKey: ['contractForecast', siteId],
    queryFn: async () => {
      // This would typically call an API, but for this example we'll generate the data
      const response = await fetch(`/api/sites/${siteId}`);
      const site: SiteRecord = await response.json();
      
      // Check if the contract has a start and end date
      const contractDetails = asJsonObject(site.contract_details, {});
      const hasValidContract = jsonToString(contractDetails.startDate) && jsonToString(contractDetails.endDate);
      
      // Generate the forecast
      const forecast = generateForecast(site);
      
      return {
        forecast,
        hasValidContract
      };
    },
    enabled: !!siteId
  });
}
