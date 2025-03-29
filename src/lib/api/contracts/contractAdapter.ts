
import { Contract, DbContract, ContractDetails } from '@/lib/types/contracts';
import { Json } from '@/lib/types/common';

/**
 * Convert a database contract to a frontend contract
 * @param dbContract Contract from database
 * @returns Contract for frontend
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
 * @returns Contract for database
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
 * Convert contract details to a database-friendly format
 * @param details Contract details from form
 * @returns Contract details for database
 */
export function contractDetailsToDb(details: ContractDetails | null | undefined): Json {
  if (!details) return null;
  
  // Create a deep copy to avoid modifying the original
  const detailsCopy = JSON.parse(JSON.stringify(details));
  
  // Ensure renewalPeriod is a string (some APIs expect this)
  if (detailsCopy.renewalPeriod !== undefined) {
    detailsCopy.renewalPeriod = String(detailsCopy.renewalPeriod);
  }
  
  // Handle terms array if it exists - convert to a serializable format
  if (Array.isArray(detailsCopy.terms)) {
    detailsCopy.terms = detailsCopy.terms.map(term => ({
      ...term,
      // Ensure any date fields are strings
      startDate: term.startDate ? String(term.startDate) : undefined,
      endDate: term.endDate ? String(term.endDate) : undefined
    }));
  }
  
  return detailsCopy as unknown as Json;
}
