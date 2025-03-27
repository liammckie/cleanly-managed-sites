
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SiteRecord } from '@/lib/types';
import { ContractSummaryData } from '@/lib/types/contracts';
import { asJsonObject } from '@/lib/utils/json';

/**
 * Hook to fetch contracts data from sites
 */
export function useContracts() {
  const { data: sites, isLoading, error } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .in('status', ['active', 'pending']);

      if (error) throw error;
      return data as SiteRecord[];
    }
  });

  // Calculate contract summary metrics
  const contractSummary: ContractSummaryData = {
    totalCount: 0,
    activeCount: 0,
    pendingCount: 0,
    totalValue: 0,
    
    // Add values for expiry metrics
    expiringWithin30Days: 0,
    expiringThisMonth: 0,
    expiringNext3Months: 0,
    expiringNext6Months: 0,
    expiringThisYear: 0,
    
    // Add values for value metrics
    valueExpiringThisMonth: 0,
    valueExpiringNext3Months: 0,
    valueExpiringNext6Months: 0,
    valueExpiringThisYear: 0,
    
    // Add values for totals
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    profitMargin: 0,
    totalContracts: 0
  };
  
  if (sites) {
    // Count metrics
    contractSummary.totalCount = sites.length;
    contractSummary.activeCount = sites.filter(s => s.status === 'active').length;
    contractSummary.pendingCount = sites.filter(s => s.status === 'pending').length;
    
    // Calculate value metrics
    sites.forEach(site => {
      if (site.monthly_revenue) {
        contractSummary.totalValue += site.monthly_revenue;
      }
      
      // Calculate expiry metrics
      const contractDetails = asJsonObject(site.contract_details, {});
      const now = new Date();
      const in30Days = new Date();
      in30Days.setDate(now.getDate() + 30);
      
      const in3Months = new Date();
      in3Months.setMonth(now.getMonth() + 3);
      
      const in6Months = new Date();
      in6Months.setMonth(now.getMonth() + 6);
      
      const inYear = new Date();
      inYear.setFullYear(now.getFullYear() + 1);
      
      if (contractDetails && contractDetails.endDate) {
        const endDateStr = contractDetails.endDate as string;
        if (endDateStr) {
          const endDate = new Date(endDateStr);
          
          if (endDate <= in30Days) {
            contractSummary.expiringWithin30Days++;
            if (site.monthly_revenue) {
              contractSummary.valueExpiringThisMonth += site.monthly_revenue;
            }
          }
          
          if (endDate <= in3Months) {
            contractSummary.expiringNext3Months++;
            if (site.monthly_revenue) {
              contractSummary.valueExpiringNext3Months += site.monthly_revenue;
            }
          }
          
          if (endDate <= in6Months) {
            contractSummary.expiringNext6Months++;
            if (site.monthly_revenue) {
              contractSummary.valueExpiringNext6Months += site.monthly_revenue;
            }
          }
          
          if (endDate <= inYear) {
            contractSummary.expiringThisYear++;
            if (site.monthly_revenue) {
              contractSummary.valueExpiringThisYear += site.monthly_revenue;
            }
          }
        }
      }
    });
    
    // Calculate profit metrics
    contractSummary.totalRevenue = contractSummary.totalValue * 12; // Annual revenue
    contractSummary.totalCost = sites.reduce((acc, site) => acc + (site.monthly_cost || 0) * 12, 0);
    contractSummary.totalProfit = contractSummary.totalRevenue - contractSummary.totalCost;
    
    if (contractSummary.totalRevenue > 0) {
      contractSummary.profitMargin = (contractSummary.totalProfit / contractSummary.totalRevenue) * 100;
    }
  }

  return {
    sites: sites || [],
    isLoading,
    error: error ? (error as Error).message : '',
    contractSummary
  };
}
