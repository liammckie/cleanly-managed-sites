
import { useState, useEffect } from 'react';
import { useSites } from '@/hooks/useSites';
import { SiteRecord } from '@/lib/types';
import { startOfMonth, addMonths, startOfDay, parseISO, isValid, compareAsc, format } from 'date-fns';
import { asJsonObject } from '@/lib/utils/json';

// Type definition for contract data
interface ContractData {
  id: string;
  siteId: string;
  siteName: string;
  clientName: string;
  contractNumber?: string;
  totalMonthlyValue: number;
  expiryDate: Date;
  expiryFormatted: string;
  timeToExpiry: number; // In months
  status: 'active' | 'expiring-soon' | 'expired' | 'pending';
}

// Type definition for grouped contract data
interface GroupedContracts {
  expiringSoon: ContractData[];
  activeContracts: ContractData[];
  pendingContracts: ContractData[];
  expiredContracts: ContractData[];
}

// Helper to determine contract status based on expiry date
function determineContractStatus(expiryDate: Date): 'active' | 'expiring-soon' | 'expired' | 'pending' {
  const now = startOfDay(new Date());
  const threeMonthsFromNow = addMonths(now, 3);
  
  if (compareAsc(expiryDate, now) < 0) {
    return 'expired';
  } else if (compareAsc(expiryDate, threeMonthsFromNow) <= 0) {
    return 'expiring-soon';
  } else {
    return 'active';
  }
}

// Custom hook to get contract forecasts
export function useContractForecast() {
  const { sites, isLoading } = useSites();
  const [contractData, setContractData] = useState<ContractData[]>([]);
  const [groupedContracts, setGroupedContracts] = useState<GroupedContracts>({
    expiringSoon: [],
    activeContracts: [],
    pendingContracts: [],
    expiredContracts: []
  });
  
  useEffect(() => {
    if (!sites || isLoading) return;
    
    const extractedContracts: ContractData[] = [];
    
    sites.forEach(site => {
      if (!site.contract_details) return;
      
      const contractDetails = asJsonObject(site.contract_details, {});
      const endDateStr = contractDetails.endDate;
      
      // Skip if no end date or invalid date
      if (!endDateStr) return;
      
      const endDate = parseISO(endDateStr);
      if (!isValid(endDate)) return;
      
      const contract: ContractData = {
        id: `${site.id}-main`,
        siteId: site.id,
        siteName: site.name,
        clientName: site.client_name || 'Unknown Client',
        contractNumber: contractDetails.contractNumber,
        totalMonthlyValue: site.monthly_revenue || 0,
        expiryDate: endDate,
        expiryFormatted: format(endDate, 'dd MMM yyyy'),
        timeToExpiry: Math.round(
          (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
        ),
        status: determineContractStatus(endDate)
      };
      
      extractedContracts.push(contract);
      
      // Check for additional contracts if available
      if (site.additional_contracts && Array.isArray(site.additional_contracts)) {
        site.additional_contracts.forEach((additionalContract, index) => {
          const additionalContractObj = asJsonObject(additionalContract, {});
          if (!additionalContractObj.end_date) return;
          
          const additionalEndDate = parseISO(additionalContractObj.end_date);
          if (!isValid(additionalEndDate)) return;
          
          const additionalContractData: ContractData = {
            id: `${site.id}-additional-${index}`,
            siteId: site.id,
            siteName: site.name,
            clientName: site.client_name || 'Unknown Client',
            contractNumber: additionalContractObj.contract_number,
            totalMonthlyValue: additionalContractObj.monthly_value || 0,
            expiryDate: additionalEndDate,
            expiryFormatted: format(additionalEndDate, 'dd MMM yyyy'),
            timeToExpiry: Math.round(
              (additionalEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
            ),
            status: determineContractStatus(additionalEndDate)
          };
          
          extractedContracts.push(additionalContractData);
        });
      }
    });
    
    setContractData(extractedContracts);
    
    // Group contracts by status
    const grouped: GroupedContracts = {
      expiringSoon: [],
      activeContracts: [],
      pendingContracts: [],
      expiredContracts: []
    };
    
    extractedContracts.forEach(contract => {
      switch (contract.status) {
        case 'expiring-soon':
          grouped.expiringSoon.push(contract);
          break;
        case 'active':
          grouped.activeContracts.push(contract);
          break;
        case 'pending':
          grouped.pendingContracts.push(contract);
          break;
        case 'expired':
          grouped.expiredContracts.push(contract);
          break;
      }
    });
    
    setGroupedContracts(grouped);
  }, [sites, isLoading]);
  
  return { contractData, groupedContracts, isLoading };
}
