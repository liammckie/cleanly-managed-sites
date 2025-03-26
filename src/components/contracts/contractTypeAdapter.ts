
import { ContractData as ContractColumns } from '@/components/contracts/ContractColumns';
import { ContractData as ContractTypes } from '@/lib/types/contracts';
import { asJsonObject } from '@/lib/utils/json';

/**
 * Converts a ContractData from lib/types/contracts to the format expected by ContractColumns
 */
export function adaptContractData(contractData: ContractTypes): ContractColumns {
  const contractDetails = asJsonObject(contractData.contract_details, {});
  
  return {
    id: contractData.id,
    site: { id: contractData.site_id, name: contractData.site_name || '' },
    client: { id: contractData.client_id || '', name: contractData.client_name || '' },
    value: contractData.monthly_revenue || 0,
    startDate: contractDetails.startDate || '',
    endDate: contractDetails.endDate || '',
    status: contractData.status === 'active' ? 'active' : 
            contractData.status === 'pending' ? 'pending' : 'expired'
  };
}

/**
 * Converts an array of ContractData objects
 */
export function adaptContractDataArray(contractData: ContractTypes[]): ContractColumns[] {
  return contractData.map(adaptContractData);
}
