import { useState, useEffect } from 'react';
import { SiteRecord } from '@/lib/types';
import { sitesApi } from '@/lib/api/sites';
import { addMonths, addDays, isAfter, isBefore, isWithinInterval } from 'date-fns';

// Define the contract summary data interface
export interface ContractSummaryData {
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  expiredCount?: number; // Make this optional to fix the error
  totalValue: number;
  avgContractValue: number;
  totalContracts: number;
  expiringWithin30Days: number;
  expiringThisMonth: number;
  expiringNext3Months: number;
  expiringNext6Months: number;
  expiringThisYear: number;
  valueExpiringThisMonth: number;
  valueExpiringNext3Months: number;
  valueExpiringNext6Months: number;
  valueExpiringThisYear: number;
  contractsByMonth: Record<string, number>;
  contractValueByMonth: Record<string, number>;
  profitMargin: number;
}

export const useContracts = () => {
  const [sites, setSites] = useState<SiteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contractSummary, setContractSummary] = useState<ContractSummaryData>({
    totalCount: 0,
    activeCount: 0,
    pendingCount: 0,
    totalValue: 0,
    avgContractValue: 0,
    totalContracts: 0,
    expiringWithin30Days: 0,
    expiringThisMonth: 0,
    expiringNext3Months: 0,
    expiringNext6Months: 0,
    expiringThisYear: 0,
    valueExpiringThisMonth: 0,
    valueExpiringNext3Months: 0,
    valueExpiringNext6Months: 0,
    valueExpiringThisYear: 0,
    contractsByMonth: {},
    contractValueByMonth: {},
    profitMargin: 0,
  });

  useEffect(() => {
    const fetchSites = async () => {
      setIsLoading(true);
      try {
        const sitesData = await sitesApi.getSites();
        setSites(sitesData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch sites');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSites();
  }, []);

  useEffect(() => {
    if (!isLoading && sites.length > 0) {
      const today = new Date();
      const thirtyDays = addDays(today, 30);
      const next3Months = addMonths(today, 3);
      const next6Months = addMonths(today, 6);
      const endOfYear = new Date(today.getFullYear(), 11, 31);

      let activeCount = 0;
      let pendingCount = 0;
      let totalValue = 0;
      let expiringWithin30Days = 0;
      let expiringThisMonth = 0;
      let expiringNext3Months = 0;
      let expiringNext6Months = 0;
      let expiringThisYear = 0;
      let valueExpiringThisMonth = 0;
      let valueExpiringNext3Months = 0;
      let valueExpiringNext6Months = 0;
      let valueExpiringThisYear = 0;
      const contractsByMonth: Record<string, number> = {};
      const contractValueByMonth: Record<string, number> = {};

      sites.forEach(site => {
        if (site.status === 'active') {
          activeCount++;
        } else if (site.status === 'pending') {
          pendingCount++;
        }

        if (site.monthly_revenue) {
          totalValue += site.monthly_revenue;
        }

        if (site.contract_details?.endDate) {
          const endDate = new Date(site.contract_details.endDate);
          const endMonth = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;

          if (isWithinInterval(endDate, { start: today, end: thirtyDays })) {
            expiringWithin30Days++;
          }

          if (endDate.getFullYear() === today.getFullYear() && endDate.getMonth() === today.getMonth()) {
            expiringThisMonth++;
            if (site.monthly_revenue) {
              valueExpiringThisMonth += site.monthly_revenue;
            }
          }

          if (isWithinInterval(endDate, { start: today, end: next3Months })) {
            expiringNext3Months++;
            if (site.monthly_revenue) {
              valueExpiringNext3Months += site.monthly_revenue;
            }
          }

          if (isWithinInterval(endDate, { start: today, end: next6Months })) {
            expiringNext6Months++;
            if (site.monthly_revenue) {
              valueExpiringNext6Months += site.monthly_revenue;
            }
          }

          if (isWithinInterval(endDate, { start: today, end: endOfYear })) {
            expiringThisYear++;
             if (site.monthly_revenue) {
              valueExpiringThisYear += site.monthly_revenue;
            }
          }

          contractsByMonth[endMonth] = (contractsByMonth[endMonth] || 0) + 1;
          contractValueByMonth[endMonth] = (contractValueByMonth[endMonth] || 0) + (site.monthly_revenue || 0);
        }
      });

      const avgContractValue = sites.length > 0 ? totalValue / sites.length : 0;

      setContractSummary({
        totalCount: sites.length,
        activeCount,
        pendingCount,
        totalValue,
        avgContractValue,
        totalContracts: sites.length,
        expiringWithin30Days,
        expiringThisMonth,
        expiringNext3Months,
        expiringNext6Months,
        expiringThisYear,
        valueExpiringThisMonth,
        valueExpiringNext3Months,
        valueExpiringNext6Months,
        valueExpiringThisYear,
        contractsByMonth,
        contractValueByMonth,
        profitMargin: 0, // Replace with actual calculation if available
      });
    }
  }, [sites, isLoading]);

  return {
    sites,
    isLoading,
    error,
    contractSummary,
  };
};
