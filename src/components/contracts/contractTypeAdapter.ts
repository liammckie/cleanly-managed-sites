
import { ContractData as ContractColumns } from '@/components/contracts/ContractColumns';
import { ContractData as ContractTypes } from '@/types/contracts';
import { asJsonObject, jsonToString } from '@/lib/utils/json';

/**
 * Converts a ContractData from lib/types/contracts to the format expected by ContractColumns
 * @param contractData Contract data from the API/database
 * @returns Contract data formatted for UI components
 */
export function adaptContractData(contractData: ContractTypes): ContractColumns {
  // Make sure we have default values if contractDetails is null or undefined
  const contractDetails = contractData.contractDetails ? 
    asJsonObject(contractData.contractDetails, { startDate: '', endDate: '' }) : 
    { startDate: '', endDate: '' };
  
  return {
    id: contractData.id,
    site: { 
      id: contractData.siteId || contractData.site?.id || '', 
      name: contractData.siteName || contractData.site?.name || '' 
    },
    client: { 
      id: contractData.clientId || contractData.client?.id || '', 
      name: contractData.clientName || contractData.client?.name || '' 
    },
    value: contractData.monthlyRevenue || contractData.value || 0,
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
