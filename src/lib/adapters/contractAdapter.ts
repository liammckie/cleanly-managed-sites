
import { Contract, ContractDetails } from '../types/contractTypes';
import { Json } from '../types/common';

export function adaptContractFromDb(dbContract: any): Contract {
  return {
    id: dbContract.id,
    site_id: dbContract.site_id,
    client_id: dbContract.client_id,
    contract_number: dbContract.contract_number,
    start_date: dbContract.start_date,
    end_date: dbContract.end_date,
    value: dbContract.value,
    status: dbContract.status || 'active',
    monthly_value: dbContract.monthly_value,
    monthly_revenue: dbContract.monthly_revenue,
    auto_renewal: dbContract.auto_renewal,
    renewal_period: dbContract.renewal_period,
    renewal_notice_days: dbContract.renewal_notice_days,
    termination_period: dbContract.termination_period,
    service_frequency: dbContract.service_frequency,
    service_delivery_method: dbContract.service_delivery_method,
    is_primary: dbContract.is_primary,
    created_at: dbContract.created_at,
    updated_at: dbContract.updated_at,
    // Optional frontend display properties
    siteName: dbContract.site_name || dbContract.siteName,
    clientName: dbContract.client_name || dbContract.clientName
  };
}

export function adaptContractToDb(contract: Partial<Contract>): any {
  return {
    id: contract.id,
    site_id: contract.site_id,
    client_id: contract.client_id,
    contract_number: contract.contract_number,
    start_date: contract.start_date,
    end_date: contract.end_date,
    value: contract.value,
    status: contract.status,
    monthly_value: contract.monthly_value,
    monthly_revenue: contract.monthly_revenue,
    auto_renewal: contract.auto_renewal,
    renewal_period: contract.renewal_period,
    renewal_notice_days: contract.renewal_notice_days,
    termination_period: contract.termination_period,
    service_frequency: contract.service_frequency,
    service_delivery_method: contract.service_delivery_method,
    is_primary: contract.is_primary
  };
}

export function adaptContractDetailsToDb(details: ContractDetails): Json {
  const result: Record<string, any> = {};
  
  // Only copy properties that exist in the details object
  if (details.id !== undefined) result.id = details.id;
  if (details.contractNumber !== undefined) result.contract_number = details.contractNumber;
  if (details.startDate !== undefined) result.start_date = details.startDate;
  if (details.endDate !== undefined) result.end_date = details.endDate;
  if (details.autoRenewal !== undefined) result.auto_renewal = details.autoRenewal;
  if (details.renewalPeriod !== undefined) result.renewal_period = details.renewalPeriod;
  if (details.renewalNoticeDays !== undefined) result.renewal_notice_days = details.renewalNoticeDays;
  if (details.terminationPeriod !== undefined) result.termination_period = details.terminationPeriod;
  if (details.value !== undefined) result.value = details.value;
  if (details.monthlyValue !== undefined) result.monthly_value = details.monthlyValue;
  if (details.annualValue !== undefined) result.annual_value = details.annualValue;
  if (details.billingCycle !== undefined) result.billing_cycle = details.billingCycle;
  if (details.serviceFrequency !== undefined) result.service_frequency = details.serviceFrequency;
  if (details.serviceDeliveryMethod !== undefined) result.service_delivery_method = details.serviceDeliveryMethod;
  if (details.contractType !== undefined) result.contract_type = details.contractType;
  if (details.notes !== undefined) result.notes = details.notes;
  if (details.status !== undefined) result.status = details.status;
  if (details.type !== undefined) result.type = details.type;
  if (details.contractLength !== undefined) result.contract_length = details.contractLength;
  if (details.contractLengthUnit !== undefined) result.contract_length_unit = details.contractLengthUnit;
  if (details.noticeUnit !== undefined) result.notice_unit = details.noticeUnit;
  if (details.renewalTerms !== undefined) result.renewal_terms = details.renewalTerms;
  
  if (details.terms && Array.isArray(details.terms)) {
    result.terms = details.terms.map(term => ({
      id: term.id,
      description: term.description,
      value: term.value,
      type: term.type
    }));
  }
  
  return result as Json;
}

export function adaptContractDetailsFromDb(dbJson: Json): ContractDetails {
  if (!dbJson) return {};
  
  const data = dbJson as Record<string, any>;
  
  const result: ContractDetails = {
    id: data.id,
    contractNumber: data.contract_number,
    startDate: data.start_date,
    endDate: data.end_date,
    autoRenewal: data.auto_renewal,
    renewalPeriod: data.renewal_period,
    renewalNoticeDays: data.renewal_notice_days,
    terminationPeriod: data.termination_period,
    value: data.value,
    monthlyValue: data.monthly_value,
    annualValue: data.annual_value,
    billingCycle: data.billing_cycle,
    serviceFrequency: data.service_frequency,
    serviceDeliveryMethod: data.service_delivery_method,
    contractType: data.contract_type,
    notes: data.notes,
    status: data.status,
    type: data.type,
    contractLength: data.contract_length,
    contractLengthUnit: data.contract_length_unit,
    noticeUnit: data.notice_unit,
    renewalTerms: data.renewal_terms
  };

  if (data.terms && Array.isArray(data.terms)) {
    result.terms = data.terms.map((term: any) => ({
      id: term.id,
      description: term.description,
      value: term.value,
      type: term.type
    }));
  }
  
  return result;
}

