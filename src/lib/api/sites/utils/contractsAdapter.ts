
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

export function adaptContractDetails(dbContract: any): ContractDetails {
  return {
    id: dbContract.id || crypto.randomUUID(),
    startDate: dbContract.start_date || dbContract.startDate || '',
    endDate: dbContract.end_date || dbContract.endDate || '',
    contractLength: dbContract.contract_length || dbContract.contractLength || 0,
    contractLengthUnit: dbContract.contract_length_unit || dbContract.contractLengthUnit || 'months',
    autoRenewal: dbContract.auto_renew || dbContract.autoRenewal || false,
    renewalPeriod: dbContract.renewal_period || dbContract.renewalPeriod || 0,
    renewalNotice: dbContract.renewal_notice || dbContract.renewalNotice || 0,
    noticeUnit: dbContract.notice_unit || dbContract.noticeUnit || 'months',
    serviceFrequency: dbContract.service_frequency || dbContract.serviceFrequency || '',
    serviceDeliveryMethod: dbContract.service_delivery_method || dbContract.serviceDeliveryMethod || '',
    contractNumber: dbContract.contract_number || dbContract.contractNumber || '',
    renewalTerms: dbContract.renewal_terms || dbContract.renewalTerms || '',
    terminationPeriod: dbContract.termination_period || dbContract.terminationPeriod || '',
    contractType: dbContract.contract_type || dbContract.contractType || 'cleaning',
    notes: dbContract.notes || '',
    terms: dbContract.terms || []
  };
}

export function prepareContractDetailsForApi(contract: Partial<ContractDetails>): any {
  return {
    start_date: contract.startDate || null,
    end_date: contract.endDate || null,
    contract_length: contract.contractLength || 0,
    contract_length_unit: contract.contractLengthUnit || 'months',
    auto_renew: contract.autoRenewal || false,
    renewal_period: contract.renewalPeriod || 0,
    renewal_notice: contract.renewalNotice || 0,
    notice_unit: contract.noticeUnit || 'months',
    service_frequency: contract.serviceFrequency || '',
    service_delivery_method: contract.serviceDeliveryMethod || '',
    contract_number: contract.contractNumber || '',
    renewal_terms: contract.renewalTerms || '',
    termination_period: contract.terminationPeriod || '',
    contract_type: contract.contractType || 'cleaning',
    notes: contract.notes || ''
  };
}
