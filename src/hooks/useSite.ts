
import { useQuery } from '@tanstack/react-query';
import { sitesApi } from '@/lib/api/sites/sitesApi';
import { getSiteAdditionalContracts, convertDbContractsToContractDetails } from '@/lib/api/sites/additionalContractsApi';
import { getSiteBillingLines } from '@/lib/api/sites/billingLinesApi';

export function useSite(siteId: string | undefined) {
  const query = useQuery({
    queryKey: ['site', siteId],
    queryFn: async () => {
      if (!siteId) return null;
      
      // Get basic site data
      const site = await sitesApi.getSiteById(siteId);
      
      if (!site) return null;

      try {
        // Get additional contracts
        const additionalContractsData = await getSiteAdditionalContracts(siteId);
        if (additionalContractsData && additionalContractsData.length > 0) {
          site.additionalContracts = convertDbContractsToContractDetails(additionalContractsData);
        } else {
          site.additionalContracts = [];
        }
        
        // Get billing lines if not already included
        if (site.billing_details && 
            (!site.billing_details.billingLines || site.billing_details.billingLines.length === 0)) {
          const billingLinesData = await getSiteBillingLines(siteId);
          if (billingLinesData && billingLinesData.length > 0) {
            // Ensure billing_details is an object
            site.billing_details = site.billing_details || {};
            
            // Convert DB format to app format
            site.billing_details.billingLines = billingLinesData.map(line => ({
              id: line.id,
              description: line.description,
              amount: line.amount,
              frequency: line.frequency,
              isRecurring: line.is_recurring,
              onHold: line.on_hold,
              weeklyAmount: line.weekly_amount,
              monthlyAmount: line.monthly_amount,
              annualAmount: line.annual_amount
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching additional site data:", error);
        // Don't fail the whole query if these additional fetches fail
      }
      
      return site;
    },
    enabled: !!siteId
  });

  return {
    site: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
  };
}
