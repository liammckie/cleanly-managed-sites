
import { useMemo } from 'react';
import { SiteRecord } from '@/lib/types';
import { addMonths, format, parseISO, isAfter, isBefore, isValid } from 'date-fns';
import { ContractForecast, ContractSummary } from '@/components/sites/forms/types/contractTypes';

export function useContractForecast(sites: SiteRecord[] | undefined) {
  const forecast = useMemo<ContractForecast[]>(() => {
    if (!sites || sites.length === 0) {
      return generateEmptyForecast();
    }

    const today = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = addMonths(today, i);
      return {
        date,
        month: format(date, 'MMM yyyy'),
        revenue: 0,
        cost: 0,
        profit: 0
      };
    });

    // Calculate the monthly values based on contract dates
    sites.forEach(site => {
      // Skip sites without contract details
      if (!site.contract_details?.startDate || !site.contract_details?.endDate) {
        return;
      }

      const startDate = parseISO(site.contract_details.startDate);
      const endDate = parseISO(site.contract_details.endDate);
      
      // Skip invalid dates
      if (!isValid(startDate) || !isValid(endDate)) {
        return;
      }

      const monthlyRevenue = site.monthly_revenue || 0;
      const monthlyCost = site.monthly_cost || 0;

      months.forEach((month, i) => {
        const currentMonth = month.date;
        // Only count revenue if the contract is active in this month
        if (
          (isBefore(startDate, currentMonth) || startDate.getMonth() === currentMonth.getMonth()) &&
          (isAfter(endDate, currentMonth) || endDate.getMonth() === currentMonth.getMonth())
        ) {
          month.revenue += monthlyRevenue;
          month.cost += monthlyCost;
          month.profit += (monthlyRevenue - monthlyCost);
        }
      });
    });

    return months;
  }, [sites]);

  const summary = useMemo<ContractSummary>(() => {
    if (!sites || sites.length === 0) {
      return {
        totalValue: 0,
        activeContracts: 0,
        expiringWithin30Days: 0,
        expiringWithin90Days: 0,
        averageContractLength: 0,
        renewalRate: 85 // Default assumption
      };
    }

    const today = new Date();
    const in30Days = addMonths(today, 1);
    const in90Days = addMonths(today, 3);
    
    // Filter for valid contract dates
    const sitesWithValidContracts = sites.filter(site => 
      site.contract_details?.startDate && 
      site.contract_details?.endDate &&
      isValid(parseISO(site.contract_details.startDate)) &&
      isValid(parseISO(site.contract_details.endDate))
    );
    
    // Sites with active contracts
    const activeContracts = sitesWithValidContracts.filter(site => {
      const endDate = parseISO(site.contract_details.endDate);
      return isAfter(endDate, today);
    });
    
    // Calculate total monthly revenue from all active contracts
    const totalMonthlyValue = activeContracts.reduce(
      (sum, site) => sum + (site.monthly_revenue || 0), 
      0
    );
    
    // Count contracts expiring soon
    const expiringWithin30Days = activeContracts.filter(site => {
      const endDate = parseISO(site.contract_details.endDate);
      return isBefore(endDate, in30Days);
    }).length;
    
    const expiringWithin90Days = activeContracts.filter(site => {
      const endDate = parseISO(site.contract_details.endDate);
      return isBefore(endDate, in90Days);
    }).length;
    
    return {
      totalValue: totalMonthlyValue,
      activeContracts: activeContracts.length,
      expiringWithin30Days,
      expiringWithin90Days,
      averageContractLength: 12, // Default to 12 months
      renewalRate: 85 // Default assumption
    };
  }, [sites]);

  return { forecast, summary };
}

// Generate empty forecast data for loading states
function generateEmptyForecast(): ContractForecast[] {
  const today = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const date = addMonths(today, i);
    return {
      month: format(date, 'MMM yyyy'),
      revenue: 0,
      cost: 0,
      profit: 0
    };
  });
}
