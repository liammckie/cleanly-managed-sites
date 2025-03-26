
import { ContractData } from '@/components/contracts/ContractColumns';
import { SiteRecord } from '@/lib/types';
import { asJsonObject } from '@/lib/utils/json';

export const adaptContractsToColumnFormat = (contracts: any[]): ContractData[] => {
  return contracts.map(contract => {
    const contractDetails = typeof contract.contract_details === 'object' 
      ? contract.contract_details 
      : asJsonObject(contract.contract_details);
    
    return {
      id: contract.id || '',
      client: contract.client_name || 'Unknown Client',
      site: contract.site_name || 'Unknown Site',
      value: contract.monthly_revenue || 0,
      startDate: contractDetails?.startDate || '',  // Using optional chaining for safety
      endDate: contractDetails?.endDate || '',      // Using optional chaining for safety
      status: (contractDetails?.status as any) || 'active'
    };
  });
};

// More adapter functions...
