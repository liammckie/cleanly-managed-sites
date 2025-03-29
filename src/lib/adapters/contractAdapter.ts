
import { Contract, ContractDetails, Json } from '@/lib/types';

export const adaptContractFromDb = (data: any): Contract => {
  return {
    id: data.id,
    siteId: data.site_id,
    clientId: data.client_id,
    contractNumber: data.contract_number || '',
    startDate: data.start_date || '',
    endDate: data.end_date || '',
    value: data.value || 0,
    status: data.status || 'active',
    monthlyValue: data.monthly_value || 0,
    monthlyRevenue: data.monthly_revenue || 0,
    autoRenewal: data.auto_renewal || false,
    renewalPeriod: data.renewal_period || '',
    renewalNoticeDays: data.renewal_notice_days || 0,
    terminationPeriod: data.termination_period || '',
    serviceFrequency: data.service_frequency || '',
    serviceDeliveryMethod: data.service_delivery_method || '',
    isPrimary: data.is_primary || false,
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || '',
    contractDetails: data.contract_details || {}
  };
};

export const adaptContractToDb = (contract: Contract): any => {
  return {
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
    is_primary: contract.isPrimary,
    contract_details: contract.contractDetails
  };
};

export const adaptContractDetailsToDb = (details: ContractDetails): Json => {
  return {
    ...details,
    renewalPeriod: details.renewalPeriod?.toString(),
    terms: details.terms?.map(term => ({
      ...term,
      id: term.id || crypto.randomUUID()
    }))
  };
};

export const adaptContractDetailsFromDb = (details: Json): ContractDetails => {
  if (!details) return {};
  
  return {
    ...details,
    renewalPeriod: details.renewalPeriod,
    terms: Array.isArray(details.terms) ? details.terms : []
  };
};

export const adaptContractDetailsToJson = adaptContractDetailsToDb;
