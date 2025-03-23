
import { useQuery } from '@tanstack/react-query';
import { getSiteById } from '@/lib/api/sites/sitesApi';
import { getSiteBillingLines } from '@/lib/api/sites/billingLinesApi';
import { getSiteAdditionalContracts, convertDbContractsToContractDetails } from '@/lib/api/sites/additionalContractsApi';

export const useSite = (siteId?: string) => {
  const { data: site, isLoading: siteLoading, error: siteError } = useQuery({
    queryKey: ['site', siteId],
    queryFn: () => getSiteById(siteId as string),
    enabled: !!siteId,
  });

  // Fetch billing lines for the site
  const { data: billingLines, isLoading: billingLinesLoading } = useQuery({
    queryKey: ['site-billing-lines', siteId],
    queryFn: () => getSiteBillingLines(siteId as string),
    enabled: !!siteId,
  });

  // Fetch additional contracts for the site
  const { data: additionalContractsData, isLoading: additionalContractsLoading } = useQuery({
    queryKey: ['site-additional-contracts', siteId],
    queryFn: () => getSiteAdditionalContracts(siteId as string),
    enabled: !!siteId,
  });

  // Convert additional contracts from DB format to app format
  const additionalContracts = additionalContractsData 
    ? convertDbContractsToContractDetails(additionalContractsData)
    : [];

  // Calculate total revenue
  const calculateRevenue = () => {
    if (!billingLines) return { weekly: 0, annual: 0 };
    
    let weeklyTotal = 0;
    let annualTotal = 0;
    
    billingLines.forEach((line: any) => {
      if (!line.on_hold) {
        weeklyTotal += line.weekly_amount || 0;
        annualTotal += line.annual_amount || 0;
      }
    });
    
    return {
      weekly: weeklyTotal,
      annual: annualTotal
    };
  };

  const revenue = calculateRevenue();

  // Enhance the site data with the billing lines and revenue data
  const enhancedSite = site ? {
    ...site,
    billingLines,
    additionalContracts,
    weekly_revenue: revenue.weekly,
    annual_revenue: revenue.annual,
  } : null;

  return {
    site: enhancedSite,
    isLoading: siteLoading || billingLinesLoading || additionalContractsLoading,
    error: siteError,
  };
};
