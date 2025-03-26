
import { ContractData as ContractColumns } from '@/components/contracts/ContractColumns';
import { ContractData as ContractTypes } from '@/lib/types/contracts';

/**
 * Converts a ContractData from lib/types/contracts to the format expected by ContractColumns
 */
export function adaptContractData(contractData: ContractTypes): ContractColumns {
  return {
    id: contractData.id,
    site: contractData.site_name,
    client: contractData.client_name,
    value: contractData.monthly_revenue || 0,
    startDate: contractData.contract_details?.startDate || '',
    endDate: contractData.contract_details?.endDate || '',
    status: contractData.status
  };
}

/**
 * Converts an array of ContractData objects
 */
export function adaptContractDataArray(contractData: ContractTypes[]): ContractColumns[] {
  return contractData.map(adaptContractData);
}
