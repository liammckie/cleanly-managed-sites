import { ContractDetails } from '@/types/contracts';
import { Json } from '@/lib/types';

// Adapter to convert contract details to DB format
export const adaptContractDetailsToDb = (details: ContractDetails): Json => {
  // Ensure we're working with a plain object for DB storage
  return {
    renewalPeriod: details.renewalPeriod,
    terms: details.terms || [],
    contractNumber: details.contractNumber,
    startDate: details.startDate,
    endDate: details.endDate,
    autoRenewal: details.autoRenewal,
    renewalNoticeDays: details.renewalNoticeDays,
    noticeUnit: details.noticeUnit,
    serviceFrequency: details.serviceFrequency,
    serviceDeliveryMethod: details.serviceDeliveryMethod,
    renewalTerms: details.renewalTerms,
    terminationPeriod: details.terminationPeriod,
    value: details.value,
    billingCycle: details.billingCycle,
    notes: details.notes,
    type: details.type,
    status: details.status,
    reviewDate: details.reviewDate,
    terminationClause: details.terminationClause,
    noticePeriodDays: details.noticePeriodDays,
    nextIncreaseDate: details.nextIncreaseDate,
    specialTerms: details.specialTerms,
    contractorChanges: details.contractorChanges
  } as unknown as Json;
};

// Adapter to convert contract details from DB format
export const adaptContractDetailsFromDb = (dbData: Json): ContractDetails => {
  if (!dbData || typeof dbData !== 'object') {
    return {} as ContractDetails;
  }
  
  // Safely cast the JSON to an object
  const data = dbData as Record<string, any>;
  
  return {
    renewalPeriod: data.renewalPeriod || '',
    terms: Array.isArray(data.terms) ? data.terms : [],
    contractNumber: data.contractNumber,
    startDate: data.startDate,
    endDate: data.endDate,
    autoRenewal: data.autoRenewal,
    renewalNoticeDays: data.renewalNoticeDays,
    noticeUnit: data.noticeUnit,
    serviceFrequency: data.serviceFrequency,
    serviceDeliveryMethod: data.serviceDeliveryMethod,
    renewalTerms: data.renewalTerms,
    terminationPeriod: data.terminationPeriod,
    value: data.value,
    billingCycle: data.billingCycle,
    notes: data.notes,
    type: data.type,
    status: data.status,
    reviewDate: data.reviewDate,
    terminationClause: data.terminationClause,
    noticePeriodDays: data.noticePeriodDays,
    nextIncreaseDate: data.nextIncreaseDate,
    specialTerms: data.specialTerms,
    contractorChanges: data.contractorChanges
  } as ContractDetails;
};

// Re-export for backward compatibility
export const adaptContractFromDb = (contract: any): any => {
  // Implementation
  return contract;
};

export const adaptContractToDb = (contract: any): any => {
  // Implementation
  return contract;
};

export const adaptContractDetailsToJson = (details: ContractDetails): string => {
  return JSON.stringify(details);
};
