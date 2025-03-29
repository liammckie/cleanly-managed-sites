
import { Contract, ContractDetails, DbContract } from '../types/contracts';
import { Json } from '../types/common';

/**
 * Converts a database contract record to a frontend Contract object
 */
export function adaptContractFromDb(dbContract: DbContract): Contract {
  return {
    id: dbContract.id,
    siteId: dbContract.site_id,
    clientId: dbContract.client_id,
    contractNumber: dbContract.contract_number,
    startDate: dbContract.start_date,
    endDate: dbContract.end_date,
    value: dbContract.value,
    status: dbContract.status || 'active',
    monthlyValue: dbContract.monthly_value,
    monthlyRevenue: dbContract.monthly_revenue,
    autoRenewal: dbContract.auto_renewal,
    renewalPeriod: dbContract.renewal_period,
    renewalNoticeDays: dbContract.renewal_notice_days,
    terminationPeriod: dbContract.termination_period,
    serviceFrequency: dbContract.service_frequency,
    serviceDeliveryMethod: dbContract.service_delivery_method,
    billingCycle: dbContract.billing_cycle,
    isPrimary: dbContract.is_primary,
    createdAt: dbContract.created_at,
    updatedAt: dbContract.updated_at,
    contractDetails: dbContract.contract_details
  };
}

/**
 * Converts a frontend Contract object to a database-friendly format
 */
export function adaptContractToDb(contract: Partial<Contract>): Partial<DbContract> {
  return {
    id: contract.id,
    site_id: contract.siteId,
    client_id: contract.clientId,
    contract_number: contract.contractNumber,
    start_date: contract.startDate,
    end_date: contract.endDate,
    value: contract.value,
    status: contract.status,
    monthly_value: contract.monthlyValue,
    monthly_revenue: contract.monthlyRevenue,
    auto_renewal: contract.autoRenewal,
    renewal_period: contract.renewalPeriod,
    renewal_notice_days: contract.renewalNoticeDays,
    termination_period: contract.terminationPeriod,
    service_frequency: contract.serviceFrequency,
    service_delivery_method: contract.serviceDeliveryMethod,
    billing_cycle: contract.billingCycle,
    is_primary: contract.isPrimary,
    contract_details: contract.contractDetails as Json
  };
}

/**
 * Converts contract details object to JSON for database storage
 */
export function adaptContractDetailsToDb(details: ContractDetails | null | undefined): Json {
  if (!details) return null as unknown as Json;
  
  // Convert the details object to JSON compatible format
  const detailsObj = {
    contractNumber: details.contractNumber,
    startDate: details.startDate,
    endDate: details.endDate,
    autoRenewal: details.autoRenewal,
    renewalPeriod: details.renewalPeriod,
    renewalNoticeDays: details.renewalNoticeDays,
    terminationPeriod: details.terminationPeriod,
    value: details.value,
    monthlyValue: details.monthlyValue,
    annualValue: details.annualValue,
    billingCycle: details.billingCycle,
    serviceFrequency: details.serviceFrequency,
    serviceDeliveryMethod: details.serviceDeliveryMethod,
    contractType: details.contractType,
    notes: details.notes,
    status: details.status,
    terms: details.terms,
    contractLength: details.contractLength,
    contractLengthUnit: details.contractLengthUnit,
    noticeUnit: details.noticeUnit,
    renewalTerms: details.renewalTerms,
    contractorChanges: details.contractorChanges
  };
  
  // Cast to Json type for database storage
  return detailsObj as unknown as Json;
}

/**
 * Converts database JSON contract details to a typed ContractDetails object
 */
export function adaptContractDetailsFromDb(details: Json | null): ContractDetails {
  if (!details) return {};
  
  return details as unknown as ContractDetails;
}

/**
 * Converts ContractDetails to a JSON string for legacy compatibility
 */
export function adaptContractDetailsToJson(details: ContractDetails | null | undefined): string {
  if (!details) return '{}';
  
  return JSON.stringify(details);
}
