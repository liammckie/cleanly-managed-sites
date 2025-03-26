
import { ContractData as ContractColumns } from '@/components/contracts/ContractColumns';
import { ContractData as ContractTypes } from '@/lib/types/contracts';
import { asJsonObject, jsonToString } from '@/lib/utils/json';

/**
 * Converts a ContractData from lib/types/contracts to the format expected by ContractColumns
 */
export function adaptContractData(contractData: ContractTypes): ContractColumns {
  // Make sure we have default values if contract_details is null or undefined
  const contractDetails = asJsonObject(contractData.contract_details, {
    startDate: '',
    endDate: ''
  });
  
  return {
    id: contractData.id,
    site: { id: contractData.site_id, name: contractData.site_name || '' },
    client: { id: contractData.client_id || '', name: contractData.client_name || '' },
    value: contractData.monthly_revenue || 0,
    startDate: jsonToString(contractDetails.startDate) || '',
    endDate: jsonToString(contractDetails.endDate) || '',
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
