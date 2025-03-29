/**
 * Contract adapter module
 * Handles transformations between database and frontend contract formats
 */
import { Json } from '../types/common';
import { ContractDetails, ContractTerm } from '../types/contractTypes';

/**
 * Convert database contract to frontend format
 */
export function adaptContractFromDb(dbContract: any): any {
  if (!dbContract) return null;

  return {
    id: dbContract.id,
    siteId: dbContract.site_id,
    clientId: dbContract.client_id,
    contractNumber: dbContract.contract_number,
    startDate: dbContract.start_date,
    endDate: dbContract.end_date,
    autoRenewal: dbContract.auto_renewal,
    renewalPeriod: dbContract.renewal_period,
    renewalNoticeDays: dbContract.renewal_notice_days,
    terminationPeriod: dbContract.termination_period,
    value: dbContract.value,
    valueType: dbContract.value_type,
    valueFrequency: dbContract.value_frequency,
    termsOfPayment: dbContract.terms_of_payment,
    billingCycle: dbContract.billing_cycle,
    contractLength: dbContract.contract_length,
    renewalTerms: dbContract.renewal_terms,
    notes: dbContract.notes,
    terms: dbContract.terms || [],
    isPrimary: dbContract.is_primary,
    status: dbContract.status,
    serviceFrequency: dbContract.service_frequency,
    serviceDeliveryMethod: dbContract.service_delivery_method,
    createdAt: dbContract.created_at,
    updatedAt: dbContract.updated_at,
    
    // Keep original snake_case fields for backward compatibility
    site_id: dbContract.site_id,
    client_id: dbContract.client_id,
    contract_number: dbContract.contract_number,
    start_date: dbContract.start_date,
    end_date: dbContract.end_date,
    auto_renewal: dbContract.auto_renewal,
    renewal_period: dbContract.renewal_period,
    renewal_notice_days: dbContract.renewal_notice_days,
    termination_period: dbContract.termination_period,
    billing_cycle: dbContract.billing_cycle,
    service_frequency: dbContract.service_frequency,
    service_delivery_method: dbContract.service_delivery_method,
    created_at: dbContract.created_at,
    updated_at: dbContract.updated_at,
    is_primary: dbContract.is_primary
  };
}

/**
 * Convert frontend contract to database format
 */
export function adaptContractToDb(contract: any): any {
  if (!contract) return null;

  return {
    id: contract.id,
    site_id: contract.siteId || contract.site_id,
    client_id: contract.clientId || contract.client_id,
    contract_number: contract.contractNumber || contract.contract_number,
    start_date: contract.startDate || contract.start_date,
    end_date: contract.endDate || contract.end_date,
    auto_renewal: contract.autoRenewal || contract.auto_renewal,
    renewal_period: contract.renewalPeriod || contract.renewal_period,
    renewal_notice_days: contract.renewalNoticeDays || contract.renewal_notice_days,
    termination_period: contract.terminationPeriod || contract.termination_period,
    value: contract.value,
    value_type: contract.valueType || contract.value_type,
    value_frequency: contract.valueFrequency || contract.value_frequency,
    terms_of_payment: contract.termsOfPayment || contract.terms_of_payment,
    billing_cycle: contract.billingCycle || contract.billing_cycle,
    contract_length: contract.contractLength || contract.contract_length,
    renewal_terms: contract.renewalTerms || contract.renewal_terms,
    notes: contract.notes,
    terms: contract.terms,
    is_primary: contract.isPrimary || contract.is_primary,
    status: contract.status,
    service_frequency: contract.serviceFrequency || contract.service_frequency,
    service_delivery_method: contract.serviceDeliveryMethod || contract.service_delivery_method
  };
}

/**
 * Convert contract details to database-friendly JSON format
 */
export function adaptContractDetailsToJson(details: ContractDetails | null | undefined): Json {
  if (!details) return null;
  
  // Create a deep copy to avoid modifying the original
  const detailsCopy = JSON.parse(JSON.stringify(details));
  
  // Ensure renewalPeriod is a string (some APIs expect this)
  if (detailsCopy.renewalPeriod !== undefined) {
    detailsCopy.renewalPeriod = String(detailsCopy.renewalPeriod);
  }
  
  // Handle terms array if it exists - convert to a serializable format
  if (Array.isArray(detailsCopy.terms)) {
    detailsCopy.terms = detailsCopy.terms.map((term: ContractTerm) => ({
      ...term,
      // Ensure any date fields are strings
      startDate: term.startDate ? String(term.startDate) : undefined,
      endDate: term.endDate ? String(term.endDate) : undefined
    }));
  }
  
  return detailsCopy as Json;
}

/**
 * Convert contract details from database to frontend format
 */
export function adaptContractDetailsFromDb(dbDetails: any): ContractDetails {
  if (!dbDetails) return {};

  return {
    id: dbDetails.id,
    contractNumber: dbDetails.contract_number,
    type: dbDetails.contract_type,
    status: dbDetails.status,
    startDate: dbDetails.start_date,
    endDate: dbDetails.end_date,
    autoRenewal: dbDetails.auto_renew,
    renewalNoticeDays: dbDetails.renewal_notice_days,
    renewalPeriod: dbDetails.renewal_period,
    renewalLengthMonths: dbDetails.renewal_length_months,
    terminationPeriod: dbDetails.termination_period,
    terminationPeriodDays: dbDetails.termination_period_days,
    value: dbDetails.value,
    valueType: dbDetails.value_type,
    valueFrequency: dbDetails.value_frequency,
    termsOfPayment: dbDetails.terms_of_payment,
    billingCycle: dbDetails.billing_cycle,
    billingDay: dbDetails.billing_day,
    lastBillingDate: dbDetails.last_billing_date,
    nextBillingDate: dbDetails.next_billing_date,
    contractLength: dbDetails.contract_length,
    contractLengthMonths: dbDetails.contract_length_months,
    renewalTerms: dbDetails.renewal_terms,
    notes: dbDetails.notes,
    terms: dbDetails.terms || []
  };
}

/**
 * Convert contract details from frontend to database format
 */
export function adaptContractDetailsToDb(details: ContractDetails): any {
  if (!details) return {};

  return {
    id: details.id,
    contract_number: details.contractNumber,
    contract_type: details.type,
    status: details.status,
    start_date: details.startDate,
    end_date: details.endDate,
    auto_renew: details.autoRenewal,
    renewal_notice_days: details.renewalNoticeDays,
    renewal_period: details.renewalPeriod,
    renewal_length_months: details.renewalLengthMonths,
    termination_period: details.terminationPeriod,
    termination_period_days: details.terminationPeriodDays,
    value: details.value,
    value_type: details.valueType,
    value_frequency: details.valueFrequency,
    terms_of_payment: details.termsOfPayment,
    billing_cycle: details.billingCycle,
    billing_day: details.billingDay,
    last_billing_date: details.lastBillingDate,
    next_billing_date: details.nextBillingDate,
    contract_length: details.contractLength,
    contract_length_months: details.contractLengthMonths,
    renewal_terms: details.renewalTerms,
    notes: details.notes,
    terms: details.terms
  };
}
