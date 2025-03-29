
import { Contract } from '@/types/db';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

/**
 * Converts a database contract record to a contract model for UI
 */
export function dbToContract(dbContract: any): Contract {
  return {
    id: dbContract.id,
    site_id: dbContract.site_id,
    contract_number: dbContract.contract_number,
    start_date: dbContract.start_date,
    end_date: dbContract.end_date,
    value: dbContract.value,
    billing_cycle: dbContract.billing_cycle,
    status: dbContract.status,
    created_at: dbContract.created_at,
    updated_at: dbContract.updated_at,
    contract_type: dbContract.contract_type,
    auto_renewal: dbContract.auto_renewal,
    renewal_terms: dbContract.renewal_terms,
    termination_period: dbContract.termination_period
  };
}

/**
 * Prepares a contract model for database insertion
 */
export function contractToDb(contract: Partial<Contract>): any {
  return {
    site_id: contract.site_id,
    contract_number: contract.contract_number,
    start_date: contract.start_date,
    end_date: contract.end_date,
    value: contract.value,
    billing_cycle: contract.billing_cycle,
    status: contract.status || 'active',
    contract_type: contract.contract_type,
    auto_renewal: contract.auto_renewal,
    renewal_terms: contract.renewal_terms,
    termination_period: contract.termination_period
  };
}

/**
 * Converts contract details to database JSON format
 */
export function contractDetailsToDb(contractDetails: ContractDetails): any {
  if (!contractDetails) {
    return {};
  }

  return {
    contractNumber: contractDetails.contractNumber || '',
    startDate: contractDetails.startDate || '',
    endDate: contractDetails.endDate || '',
    autoRenewal: contractDetails.autoRenewal || false,
    renewalPeriod: contractDetails.renewalPeriod || 0,
    renewalNotice: contractDetails.renewalNotice || 0,
    noticeUnit: contractDetails.noticeUnit || 'days',
    terminationPeriod: contractDetails.terminationPeriod || '',
    renewalTerms: contractDetails.renewalTerms || '',
    contractLength: contractDetails.contractLength || 0,
    contractLengthUnit: contractDetails.contractLengthUnit || 'months',
    contractType: contractDetails.contractType || '',
    serviceFrequency: contractDetails.serviceFrequency || ''
  };
}

/**
 * Maps fields between different contract formats, handles empty objects
 */
export function mapContractFields(contractData: any = {}) {
  return {
    ...contractData,
    startDate: contractData.startDate || contractData.start_date || '',
    endDate: contractData.endDate || contractData.end_date || ''
  };
}
