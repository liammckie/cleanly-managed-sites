
import { Contract, DbContract, ContractDetailsForm } from '@/types/db';
import { ContractDetails as SiteContractDetails } from '@/components/sites/forms/types/contractTypes';
import { ContractDetails as TypeContractDetails } from '@/types/contracts';
import { Json } from '@/types/common';

/**
 * Convert site contract details to a database-friendly format
 */
export function adaptSiteContractDetails(details: SiteContractDetails): Partial<DbContract> {
  if (!details) return {};
  
  return {
    contract_number: details.contractNumber,
    start_date: details.startDate,
    end_date: details.endDate,
    auto_renewal: details.autoRenewal,
    renewal_period: details.renewalPeriod ? String(details.renewalPeriod) : undefined,
    renewal_notice_days: details.renewalNoticeDays,
    termination_period: details.terminationPeriod,
    billing_cycle: details.billingCycle as any,
    service_frequency: details.serviceFrequency,
    service_delivery_method: details.serviceDeliveryMethod,
    value: details.value
  };
}

/**
 * Convert contract details from types/contracts to a database-friendly format
 */
export function adaptTypeContractDetails(details: TypeContractDetails): Partial<DbContract> {
  if (!details) return {};
  
  return {
    contract_number: details.contractNumber,
    start_date: details.startDate,
    end_date: details.endDate,
    auto_renewal: details.autoRenewal,
    renewal_period: details.renewalPeriod ? String(details.renewalPeriod) : undefined,
    renewal_notice_days: details.renewalNoticeDays,
    termination_period: details.terminationPeriod,
    billing_cycle: details.billingCycle as any,
    service_frequency: details.serviceFrequency,
    service_delivery_method: details.serviceDeliveryMethod,
    value: details.value
  };
}

/**
 * Generic function to convert contract details from any source to a database-friendly format
 */
export function adaptContractDetailsToDb(details: any): Partial<DbContract> {
  if (!details) return {};
  
  return {
    contract_number: details.contractNumber,
    start_date: details.startDate,
    end_date: details.endDate,
    auto_renewal: details.autoRenewal,
    renewal_period: details.renewalPeriod ? String(details.renewalPeriod) : undefined,
    renewal_notice_days: details.renewalNoticeDays,
    termination_period: details.terminationPeriod,
    billing_cycle: details.billingCycle,
    service_frequency: details.serviceFrequency,
    service_delivery_method: details.serviceDeliveryMethod,
    value: details.value
  };
}

/**
 * Convert JSON contract details to a structured object
 */
export function jsonToContractDetails(json: Json): TypeContractDetails {
  if (!json) return {};
  
  const details = typeof json === 'string' ? JSON.parse(json) : json;
  
  return {
    contractNumber: details.contractNumber || details.contract_number,
    startDate: details.startDate || details.start_date,
    endDate: details.endDate || details.end_date,
    autoRenewal: details.autoRenewal || details.auto_renewal,
    renewalPeriod: details.renewalPeriod || details.renewal_period,
    renewalNoticeDays: details.renewalNoticeDays || details.renewal_notice_days,
    terminationPeriod: details.terminationPeriod || details.termination_period,
    billingCycle: details.billingCycle || details.billing_cycle,
    serviceFrequency: details.serviceFrequency || details.service_frequency,
    serviceDeliveryMethod: details.serviceDeliveryMethod || details.service_delivery_method,
    value: details.value
  };
}
