
import { Contract, DbContract, ContractDetailsForm } from '@/types/db';
import { ContractData, ContractSummaryData } from '@/types/contracts';
import { asJsonObject } from '@/lib/utils/json';

/**
 * Convert a database contract to a frontend contract representation
 * @param dbContract Contract from the database
 * @returns Normalized contract for frontend use
 */
export function dbToContract(dbContract: DbContract): Contract {
  return {
    id: dbContract.id,
    siteId: dbContract.site_id,
    clientId: dbContract.client_id,
    status: dbContract.status,
    contractNumber: dbContract.contract_number,
    startDate: dbContract.start_date,
    endDate: dbContract.end_date,
    value: dbContract.value,
    monthlyRevenue: dbContract.monthly_revenue,
    contractDetails: dbContract.contract_details,
    autoRenewal: dbContract.auto_renewal,
    renewalPeriod: dbContract.renewal_period,
    renewalNoticeDays: dbContract.renewal_notice_days,
    terminationPeriod: dbContract.termination_period,
    billingCycle: dbContract.billing_cycle,
    serviceFrequency: dbContract.service_frequency,
    serviceDeliveryMethod: dbContract.service_delivery_method,
    isPrimary: dbContract.is_primary,
    createdAt: dbContract.created_at,
    updatedAt: dbContract.updated_at
  };
}

/**
 * Convert a frontend contract to a database contract
 * @param contract Contract from frontend
 * @returns Contract formatted for database storage
 */
export function contractToDb(contract: Contract): DbContract {
  return {
    id: contract.id,
    site_id: contract.siteId,
    client_id: contract.clientId,
    status: contract.status,
    contract_number: contract.contractNumber,
    start_date: contract.startDate,
    end_date: contract.endDate,
    value: contract.value,
    monthly_revenue: contract.monthlyRevenue,
    contract_details: contract.contractDetails,
    auto_renewal: contract.autoRenewal,
    renewal_period: contract.renewalPeriod,
    renewal_notice_days: contract.renewalNoticeDays,
    termination_period: contract.terminationPeriod,
    billing_cycle: contract.billingCycle,
    service_frequency: contract.serviceFrequency,
    service_delivery_method: contract.serviceDeliveryMethod,
    is_primary: contract.isPrimary,
    created_at: contract.createdAt,
    updated_at: contract.updatedAt
  };
}

/**
 * Adapt contract data from site records for the contract list
 * @param data Site or contract data from API
 * @returns Normalized contract data for UI
 */
export function adaptContract(data: any): ContractData {
  // Extract contract details safely
  const contractDetails = data.contract_details ? 
    asJsonObject(data.contract_details, {}) : 
    {};

  return {
    id: data.id,
    siteId: data.site_id || data.id,
    siteName: data.site_name || data.name,
    clientId: data.client_id,
    clientName: data.client_name,
    value: data.value || data.monthly_revenue || 0,
    startDate: contractDetails.startDate || contractDetails.start_date || '',
    endDate: contractDetails.endDate || contractDetails.end_date || '',
    status: data.status || 'active',
    monthlyRevenue: data.monthly_revenue || 0,
    contractDetails: data.contract_details,
    // Support for legacy field names
    site: {
      id: data.site_id || data.id,
      name: data.site_name || data.name
    },
    client: {
      id: data.client_id,
      name: data.client_name
    },
    isPrimary: data.is_primary
  };
}

/**
 * Adapt multiple contracts
 * @param data Array of site or contract data
 * @returns Array of normalized contract data
 */
export function adaptContracts(data: any[]): ContractData[] {
  return data.map(adaptContract);
}

/**
 * Adapt contract details form data for API/database
 * @param formData Contract details from form
 * @returns Formatted contract details for storage
 */
export function adaptContractDetailsForm(formData: ContractDetailsForm): any {
  return {
    id: formData.id,
    contractNumber: formData.contractNumber,
    startDate: formData.startDate,
    endDate: formData.endDate,
    autoRenewal: formData.autoRenewal,
    renewalPeriod: formData.renewalPeriod ? String(formData.renewalPeriod) : undefined,
    renewalNoticeDays: formData.renewalNoticeDays,
    noticeUnit: formData.noticeUnit,
    terminationPeriod: formData.terminationPeriod,
    renewalTerms: formData.renewalTerms,
    contractLength: formData.contractLength,
    contractLengthUnit: formData.contractLengthUnit,
    serviceFrequency: formData.serviceFrequency,
    serviceDeliveryMethod: formData.serviceDeliveryMethod,
    terms: formData.terms,
    additionalContracts: formData.additionalContracts,
    contractType: formData.contractType,
    value: formData.value,
    billingCycle: formData.billingCycle,
    notes: formData.notes,
    type: formData.type,
    status: formData.status
  };
}
