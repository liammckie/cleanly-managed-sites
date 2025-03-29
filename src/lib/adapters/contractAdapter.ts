
/**
 * Adapter functions for converting between database and frontend contract formats
 */
import { Contract, ContractDetails } from '../types/contractTypes';
import { Json } from '../types/common';

/**
 * Convert a database contract record to frontend format
 */
export function adaptContractFromDb(dbContract: any): Contract {
  return {
    id: dbContract.id,
    site_id: dbContract.site_id,
    client_id: dbContract.client_id,
    contract_number: dbContract.contract_number,
    start_date: dbContract.start_date,
    end_date: dbContract.end_date,
    value: dbContract.value,
    auto_renewal: dbContract.auto_renewal,
    renewal_period: dbContract.renewal_period,
    renewal_notice_days: dbContract.renewal_notice_days,
    termination_period: dbContract.termination_period,
    billing_cycle: dbContract.billing_cycle,
    contract_type: dbContract.contract_type,
    service_frequency: dbContract.service_frequency,
    service_delivery_method: dbContract.service_delivery_method,
    created_at: dbContract.created_at,
    updated_at: dbContract.updated_at,
    notes: dbContract.notes,
    status: dbContract.status,
    monthly_revenue: dbContract.monthly_revenue,
    contract_details: dbContract.contract_details,
    is_primary: dbContract.is_primary,
    // Add frontend-compatible properties
    siteId: dbContract.site_id,
    clientId: dbContract.client_id,
    siteName: dbContract.site_name || dbContract.siteName,
    clientName: dbContract.client_name || dbContract.clientName,
    startDate: dbContract.start_date,
    endDate: dbContract.end_date,
    autoRenewal: dbContract.auto_renewal,
    renewalPeriod: dbContract.renewal_period,
    renewalNoticeDays: dbContract.renewal_notice_days,
    terminationPeriod: dbContract.termination_period,
    billingCycle: dbContract.billing_cycle,
    contractType: dbContract.contract_type,
    serviceFrequency: dbContract.service_frequency,
    serviceDeliveryMethod: dbContract.service_delivery_method,
    monthlyRevenue: dbContract.monthly_revenue,
    contractDetails: dbContract.contract_details,
    isPrimary: dbContract.is_primary,
    createdAt: dbContract.created_at,
    updatedAt: dbContract.updated_at
  };
}

/**
 * Convert a frontend contract to database format
 */
export function adaptContractToDb(contract: Partial<Contract>): any {
  return {
    id: contract.id,
    site_id: contract.site_id || contract.siteId,
    client_id: contract.client_id || contract.clientId,
    contract_number: contract.contract_number || contract.contractNumber,
    start_date: contract.start_date || contract.startDate,
    end_date: contract.end_date || contract.endDate,
    value: contract.value,
    auto_renewal: contract.auto_renewal || contract.autoRenewal,
    renewal_period: contract.renewal_period || contract.renewalPeriod,
    renewal_notice_days: contract.renewal_notice_days || contract.renewalNoticeDays,
    termination_period: contract.termination_period || contract.terminationPeriod,
    billing_cycle: contract.billing_cycle || contract.billingCycle,
    contract_type: contract.contract_type || contract.contractType,
    service_frequency: contract.service_frequency || contract.serviceFrequency,
    service_delivery_method: contract.service_delivery_method || contract.serviceDeliveryMethod,
    notes: contract.notes,
    status: contract.status,
    monthly_revenue: contract.monthly_revenue || contract.monthlyRevenue,
    is_primary: contract.is_primary || contract.isPrimary
  };
}

/**
 * Convert contract details to database JSON format
 */
export function adaptContractDetailsToDb(details: ContractDetails): Json {
  // Safely handle the conversion without using direct assignment
  const result: Record<string, any> = {};
  
  // Only copy properties that exist in the details object
  if (details.id !== undefined) result.id = details.id;
  if (details.contractNumber !== undefined) result.contractNumber = details.contractNumber;
  if (details.startDate !== undefined) result.startDate = details.startDate;
  if (details.endDate !== undefined) result.endDate = details.endDate;
  if (details.autoRenewal !== undefined) result.autoRenewal = details.autoRenewal;
  if (details.renewalPeriod !== undefined) result.renewalPeriod = details.renewalPeriod;
  if (details.renewalNoticeDays !== undefined) result.renewalNoticeDays = details.renewalNoticeDays;
  if (details.terminationPeriod !== undefined) result.terminationPeriod = details.terminationPeriod;
  if (details.billingCycle !== undefined) result.billingCycle = details.billingCycle;
  if (details.serviceFrequency !== undefined) result.serviceFrequency = details.serviceFrequency;
  if (details.serviceDeliveryMethod !== undefined) result.serviceDeliveryMethod = details.serviceDeliveryMethod;
  if (details.contractType !== undefined) result.contractType = details.contractType;
  if (details.value !== undefined) result.value = details.value;
  if (details.notes !== undefined) result.notes = details.notes;
  if (details.status !== undefined) result.status = details.status;
  if (details.noticeUnit !== undefined) result.noticeUnit = details.noticeUnit;
  if (details.contractLength !== undefined) result.contractLength = details.contractLength;
  if (details.contractLengthUnit !== undefined) result.contractLengthUnit = details.contractLengthUnit;
  if (details.type !== undefined) result.type = details.type;
  if (details.renewalTerms !== undefined) result.renewalTerms = details.renewalTerms;
  
  // Handle the terms array carefully
  if (details.terms && Array.isArray(details.terms)) {
    result.terms = details.terms.map(term => {
      const termObj: Record<string, any> = {};
      // Copy only properties that exist
      if (term.id !== undefined) termObj.id = term.id;
      if (term.name !== undefined) termObj.name = term.name;
      if (term.description !== undefined) termObj.description = term.description;
      if (term.startDate !== undefined) termObj.startDate = term.startDate;
      if (term.endDate !== undefined) termObj.endDate = term.endDate;
      if (term.renewalTerms !== undefined) termObj.renewalTerms = term.renewalTerms;
      if (term.terminationPeriod !== undefined) termObj.terminationPeriod = term.terminationPeriod;
      if (term.autoRenew !== undefined) termObj.autoRenew = term.autoRenew;
      if (term.value !== undefined) termObj.value = term.value;
      if (term.unit !== undefined) termObj.unit = term.unit;
      if (term.type !== undefined) termObj.type = term.type;
      return termObj;
    });
  }
  
  return result as Json;
}

/**
 * Convert database JSON to contract details
 */
export function adaptContractDetailsFromDb(dbJson: Json): ContractDetails {
  if (!dbJson) return {};
  
  // Safely handle the conversion by creating a new object
  const result: ContractDetails = {};
  
  // Type assertion to access properties
  const data = dbJson as Record<string, any>;
  
  // Map properties with safe access
  if (data.id !== undefined) result.id = data.id;
  if (data.contractNumber !== undefined) result.contractNumber = data.contractNumber;
  if (data.startDate !== undefined) result.startDate = data.startDate;
  if (data.endDate !== undefined) result.endDate = data.endDate;
  if (data.autoRenewal !== undefined) result.autoRenewal = data.autoRenewal;
  if (data.renewalPeriod !== undefined) result.renewalPeriod = data.renewalPeriod;
  if (data.renewalNoticeDays !== undefined) result.renewalNoticeDays = data.renewalNoticeDays;
  if (data.terminationPeriod !== undefined) result.terminationPeriod = data.terminationPeriod;
  if (data.billingCycle !== undefined) result.billingCycle = data.billingCycle;
  if (data.serviceFrequency !== undefined) result.serviceFrequency = data.serviceFrequency;
  if (data.serviceDeliveryMethod !== undefined) result.serviceDeliveryMethod = data.serviceDeliveryMethod;
  if (data.contractType !== undefined) result.contractType = data.contractType;
  if (data.value !== undefined) result.value = data.value;
  if (data.notes !== undefined) result.notes = data.notes;
  if (data.status !== undefined) result.status = data.status;
  if (data.noticeUnit !== undefined) result.noticeUnit = data.noticeUnit;
  if (data.contractLength !== undefined) result.contractLength = data.contractLength;
  if (data.contractLengthUnit !== undefined) result.contractLengthUnit = data.contractLengthUnit;
  if (data.type !== undefined) result.type = data.type;
  if (data.renewalTerms !== undefined) result.renewalTerms = data.renewalTerms;
  
  // Handle terms array if it exists
  if (data.terms && Array.isArray(data.terms)) {
    result.terms = data.terms.map((term: any) => ({
      id: term.id,
      name: term.name,
      description: term.description,
      startDate: term.startDate,
      endDate: term.endDate,
      renewalTerms: term.renewalTerms,
      terminationPeriod: term.terminationPeriod,
      autoRenew: term.autoRenew,
      value: term.value,
      unit: term.unit,
      type: term.type
    }));
  }
  
  return result;
}

/**
 * Convert contract details to JSON string
 */
export function adaptContractDetailsToJson(details: ContractDetails): string {
  return JSON.stringify(adaptContractDetailsToDb(details));
}
