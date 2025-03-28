
import { ContractData as ContractColumns } from '@/components/contracts/ContractColumns';
import { ContractData as ContractTypes } from '@/types/contracts';
import { asJsonObject, jsonToString } from '@/lib/utils/json';

/**
 * Converts a ContractData from lib/types/contracts to the format expected by ContractColumns
 * @param contractData Contract data from the API/database
 * @returns Contract data formatted for UI components
 */
export function adaptContractData(contractData: ContractTypes): ContractColumns {
  // Make sure we have default values if contract_details is null or undefined
  const contractDetails = contractData.contract_details ? 
    asJsonObject(contractData.contract_details, { startDate: '', endDate: '' }) : 
    { startDate: '', endDate: '' };
  
  return {
    id: contractData.id,
    site: { 
      id: contractData.site_id || contractData.site?.id || '', 
      name: contractData.site_name || contractData.site?.name || '' 
    },
    client: { 
      id: contractData.client_id || contractData.client?.id || '', 
      name: contractData.client_name || contractData.client?.name || '' 
    },
    value: contractData.monthly_revenue || contractData.value || 0,
    startDate: jsonToString(contractDetails.startDate) || '',
    endDate: jsonToString(contractDetails.endDate) || '',
    status: contractData.status === 'active' ? 'active' : 
            contractData.status === 'pending' ? 'pending' : 'expired'
  };
}

/**
 * Converts an array of ContractData objects
 * @param contractData Array of contract data from API/database
 * @returns Array of contract data formatted for UI components
 */
export function adaptContractDataArray(contractData: ContractTypes[]): ContractColumns[] {
  return contractData.map(adaptContractData);
}
