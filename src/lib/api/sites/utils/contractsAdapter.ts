
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

export function adaptContractDetailsForDb(contractDetails: Partial<ContractDetails>) {
  return {
    id: contractDetails.id,
    startDate: contractDetails.startDate,
    endDate: contractDetails.endDate,
    contractNumber: contractDetails.contractNumber,
    contractLength: contractDetails.contractLength,
    contractLengthUnit: contractDetails.contractLengthUnit,
    autoRenewal: contractDetails.autoRenewal,
    renewalPeriod: contractDetails.renewalPeriod,
    renewalNotice: contractDetails.renewalNotice,
    noticeUnit: contractDetails.noticeUnit,
    serviceFrequency: contractDetails.serviceFrequency,
    serviceDeliveryMethod: contractDetails.serviceDeliveryMethod,
    renewalTerms: contractDetails.renewalTerms,
    terminationPeriod: contractDetails.terminationPeriod,
    contractType: contractDetails.contractType,
    terms: contractDetails.terms,
    value: contractDetails.value,
    billingCycle: contractDetails.billingCycle,
    notes: contractDetails.notes
  };
}

export function adaptDbToContractDetails(dbContractDetails: any): ContractDetails {
  // Ensure we handle null/undefined values
  if (!dbContractDetails) return {} as ContractDetails;
  
  // Convert from DB snake_case to camelCase if needed
  const convertedDetails = {
    id: dbContractDetails.id,
    startDate: dbContractDetails.startDate || dbContractDetails.start_date,
    endDate: dbContractDetails.endDate || dbContractDetails.end_date,
    contractNumber: dbContractDetails.contractNumber || dbContractDetails.contract_number,
    contractLength: dbContractDetails.contractLength || dbContractDetails.contract_length,
    contractLengthUnit: dbContractDetails.contractLengthUnit || dbContractDetails.contract_length_unit,
    autoRenewal: dbContractDetails.autoRenewal || dbContractDetails.auto_renewal,
    renewalPeriod: dbContractDetails.renewalPeriod || dbContractDetails.renewal_period,
    renewalNotice: dbContractDetails.renewalNotice || dbContractDetails.renewal_notice,
    noticeUnit: dbContractDetails.noticeUnit || dbContractDetails.notice_unit,
    serviceFrequency: dbContractDetails.serviceFrequency || dbContractDetails.service_frequency,
    serviceDeliveryMethod: dbContractDetails.serviceDeliveryMethod || dbContractDetails.service_delivery_method,
    renewalTerms: dbContractDetails.renewalTerms || dbContractDetails.renewal_terms,
    terminationPeriod: dbContractDetails.terminationPeriod || dbContractDetails.termination_period,
    contractType: dbContractDetails.contractType || dbContractDetails.contract_type,
    terms: dbContractDetails.terms,
    value: dbContractDetails.value,
    billingCycle: dbContractDetails.billingCycle || dbContractDetails.billing_cycle,
    notes: dbContractDetails.notes
  };

  return convertedDetails as ContractDetails;
}
