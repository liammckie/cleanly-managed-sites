
import { ContractData as ContractColumnData } from '@/components/contracts/ContractColumns';
import { ContractData } from '@/lib/types/contracts';

// Adapter to convert backend contract data to the format expected by the UI
export const adaptContractToColumnFormat = (contract: ContractData): ContractColumnData => {
  return {
    id: contract.id,
    client: contract.client_name,
    site: contract.site_name,
    value: contract.monthly_revenue,
    startDate: contract.contract_details?.startDate || "",
    endDate: contract.contract_details?.endDate || "", 
    status: contract.status as 'active' | 'pending' | 'expired' | 'terminated'
  };
};

// Function to convert an array of contracts
export const adaptContractsToColumnFormat = (contracts: ContractData[]): ContractColumnData[] => {
  return contracts.map(adaptContractToColumnFormat);
};
