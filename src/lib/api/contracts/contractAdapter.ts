
import { ContractData } from '@/components/contracts/ContractColumns';
import { SiteRecord } from '@/lib/types';
import { asJsonObject } from '@/lib/utils/json';

export const adaptContractsToColumnFormat = (contracts: any[]): ContractData[] => {
  return contracts.map(contract => {
    const contractDetails = typeof contract.contract_details === 'object' 
      ? contract.contract_details 
      : asJsonObject(contract.contract_details, {});
    
    // Safely access properties
    const startDate = contractDetails && typeof contractDetails === 'object' ? contractDetails.startDate || '' : '';
    const endDate = contractDetails && typeof contractDetails === 'object' ? contractDetails.endDate || '' : '';
    const status = contractDetails && typeof contractDetails === 'object' ? contractDetails.status || 'active' : 'active';
    
    return {
      id: contract.id || '',
      client: contract.client_name || 'Unknown Client',
      site: contract.site_name || 'Unknown Site',
      value: contract.monthly_revenue || 0,
      startDate: startDate,
      endDate: endDate,
      status: status as any
    };
  });
};

// More adapter functions...
