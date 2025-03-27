
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

export const adaptContractToDb = (contractData: Partial<ContractDetails>) => {
  return {
    id: contractData.id,
    contract_number: contractData.contractNumber,
    start_date: contractData.startDate,
    end_date: contractData.endDate,
    auto_renew: contractData.autoRenewal,
    contract_length: contractData.contractLength,
    contract_length_unit: contractData.contractLengthUnit,
    contract_type: contractData.contractType || 'cleaning',
    renewal_period: contractData.renewalPeriod,
    renewal_notice: contractData.renewalNoticeDays,
    notice_unit: contractData.noticeUnit,
    service_frequency: contractData.serviceFrequency,
    service_delivery_method: contractData.serviceDeliveryMethod,
    renewal_terms: contractData.renewalTerms,
    termination_period: contractData.terminationPeriod,
    value: contractData.value,
    billing_cycle: contractData.billingCycle,
    notes: contractData.notes,
  };
};

export const adaptDbToContract = (dbData: any): ContractDetails => {
  if (!dbData) return {};
  
  return {
    id: dbData.id,
    contractNumber: dbData.contract_number,
    startDate: dbData.start_date,
    endDate: dbData.end_date,
    autoRenewal: dbData.auto_renew,
    contractLength: dbData.contract_length,
    contractLengthUnit: dbData.contract_length_unit,
    contractType: dbData.contract_type,
    renewalPeriod: dbData.renewal_period,
    renewalNoticeDays: dbData.renewal_notice,
    noticeUnit: dbData.notice_unit,
    serviceFrequency: dbData.service_frequency,
    serviceDeliveryMethod: dbData.service_delivery_method,
    renewalTerms: dbData.renewal_terms,
    terminationPeriod: dbData.termination_period,
    value: dbData.value,
    billingCycle: dbData.billing_cycle,
    notes: dbData.notes,
  };
};
