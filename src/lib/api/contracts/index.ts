
import { Contract } from '@/lib/types/contracts';
import { contractToDb, dbToContract, contractDetailsToDb } from './contractAdapter';

// Re-export the adapter functions
export {
  contractToDb,
  dbToContract,
  contractDetailsToDb
};

// Adapter functions to fix the errors
export const adaptContractData = (contract: any): Contract => {
  return {
    id: contract.id,
    siteId: contract.site_id || '',
    clientId: contract.client_id || '',
    contractNumber: contract.contract_number || '',
    startDate: contract.start_date || '',
    endDate: contract.end_date || '',
    value: contract.value || 0,
    status: contract.status || 'active',
    autoRenewal: contract.auto_renewal || false,
    renewalPeriod: contract.renewal_period || '',
    renewalNoticeDays: contract.renewal_notice_days || 0,
    terminationPeriod: contract.termination_period || '',
    serviceFrequency: contract.service_frequency || '',
    serviceDeliveryMethod: contract.service_delivery_method || '',
    isPrimary: contract.is_primary || false,
    createdAt: contract.created_at || '',
    updatedAt: contract.updated_at || '',
    siteName: contract.site_name,
    clientName: contract.client_name,
    contractDetails: contract.contract_details
  };
};

export const adaptContracts = (contracts: any[]): Contract[] => {
  return contracts.map(adaptContractData);
};

// Add any missing type definitions
export interface ContractAdapterOptions {
  includeClientData?: boolean;
  includeSiteData?: boolean;
}
