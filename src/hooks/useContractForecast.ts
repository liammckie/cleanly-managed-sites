
import { useMemo } from 'react';
import { SiteRecord } from '@/lib/types';
import { ContractForecastItem, ContractSummaryData } from '@/lib/types/contracts';
import { addMonths, format, isAfter, isBefore, parseISO } from 'date-fns';
import { asJsonObject } from '@/lib/utils/json';

/**
 * Hook to generate contract forecast data
 */
export function useContractForecast(sites: SiteRecord[] = [], months: number = 12) {
  /**
   * Generate forecast data based on current contracts
   */
  const forecastData = useMemo(() => {
    if (!sites.length) return [];
    
    const today = new Date();
    const forecastItems: ContractForecastItem[] = [];
    const forecastEnd = addMonths(today, months);
    
    // Process each site's contract
    sites.forEach(site => {
      if (!site.contract_details) return;
      
      const contractDetails = asJsonObject(site.contract_details, {
        endDate: '',
        startDate: '',
        contractNumber: '',
        value: 0
      });
      
      // Skip if no end date
      if (!contractDetails.endDate) return;
      
      try {
        const endDate = new Date(contractDetails.endDate);
        
        // Only include contracts that end within our forecast period and haven't ended yet
        if (isBefore(endDate, today) || isAfter(endDate, forecastEnd)) return;
        
        forecastItems.push({
          siteId: site.id,
          siteName: site.name,
          clientId: site.client_id || '',
          clientName: site.client_name || '',
          contractNumber: contractDetails.contractNumber || 'No reference',
          endDate: format(endDate, 'yyyy-MM-dd'),
          monthlyValue: site.monthly_revenue || 0,
          expiringIn: Math.round((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)),
        });
      } catch (error) {
        console.error(`Error processing contract for site ${site.name}:`, error);
      }
    });
    
    // Also check for additional contracts
    sites.forEach(site => {
      const additionalContracts = site.additional_contracts;
      if (!additionalContracts || !Array.isArray(additionalContracts)) return;
      
      additionalContracts.forEach(contract => {
        // Parse the contract JSON
        const contractData = asJsonObject(contract, {
          end_date: '',
          contract_number: '',
          monthly_value: 0
        });
        
        // Skip if no end date
        if (!contractData.end_date) return;
        
        try {
          const endDate = new Date(contractData.end_date);
          
          // Only include contracts that end within our forecast period and haven't ended yet
          if (isBefore(endDate, today) || isAfter(endDate, forecastEnd)) return;
          
          forecastItems.push({
            siteId: site.id,
            siteName: site.name,
            clientId: site.client_id || '',
            clientName: site.client_name || '',
            contractNumber: contractData.contract_number || 'No reference',
            endDate: format(endDate, 'yyyy-MM-dd'),
            monthlyValue: contractData.monthly_value || 0,
            expiringIn: Math.round((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)),
            isAdditionalContract: true
          });
        } catch (error) {
          console.error(`Error processing additional contract for site ${site.name}:`, error);
        }
      });
    });
    
    // Sort by expiry date (ascending)
    return forecastItems.sort((a, b) => {
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    });
  }, [sites, months]);
  
  /**
   * Generate summary data about expirations and contract values
   */
  const summaryData = useMemo((): ContractSummaryData => {
    if (!forecastData.length) {
      return {
        expiringThisMonth: 0,
        expiringNext3Months: 0,
        expiringNext6Months: 0,
        expiringThisYear: 0,
        valueExpiringThisMonth: 0,
        valueExpiringNext3Months: 0,
        valueExpiringNext6Months: 0,
        valueExpiringThisYear: 0,
        totalContracts: 0,
        totalValue: 0
      };
    }
    
    const summary: ContractSummaryData = {
      expiringThisMonth: 0,
      expiringNext3Months: 0,
      expiringNext6Months: 0,
      expiringThisYear: 0,
      valueExpiringThisMonth: 0,
      valueExpiringNext3Months: 0,
      valueExpiringNext6Months: 0,
      valueExpiringThisYear: 0,
      totalContracts: forecastData.length,
      totalValue: forecastData.reduce((sum, item) => sum + item.monthlyValue, 0)
    };
    
    forecastData.forEach(item => {
      if (item.expiringIn <= 1) {
        summary.expiringThisMonth++;
        summary.valueExpiringThisMonth += item.monthlyValue;
      }
      
      if (item.expiringIn <= 3) {
        summary.expiringNext3Months++;
        summary.valueExpiringNext3Months += item.monthlyValue;
      }
      
      if (item.expiringIn <= 6) {
        summary.expiringNext6Months++;
        summary.valueExpiringNext6Months += item.monthlyValue;
      }
      
      if (item.expiringIn <= 12) {
        summary.expiringThisYear++;
        summary.valueExpiringThisYear += item.monthlyValue;
      }
    });
    
    return summary;
  }, [forecastData]);
  
  return {
    forecastData,
    summaryData
  };
}
