
import { mapToDb, mapFromDb } from '../mappers';
import { Contract } from '@/types/db';

/**
 * Convert a contract object from API/DB format to frontend format
 */
export const adaptContractToFrontend = (contract: any) => {
  const frontendContract = {
    id: contract.id,
    siteId: contract.site_id,
    clientId: contract.client_id,
    siteName: contract.site?.name,
    clientName: contract.client?.name,
    contractNumber: contract.contract_number,
    startDate: contract.start_date,
    endDate: contract.end_date,
    value: contract.value,
    monthlyRevenue: contract.monthly_revenue,
    contractDetails: contract.contract_details,
    autoRenewal: contract.auto_renewal,
    renewalPeriod: contract.renewal_period,
    renewalNoticeDays: contract.renewal_notice_days,
    terminationPeriod: contract.termination_period,
    billingCycle: contract.billing_cycle,
    serviceFrequency: contract.service_frequency,
    serviceDeliveryMethod: contract.service_delivery_method,
    isPrimary: contract.is_primary,
    createdAt: contract.created_at,
    updatedAt: contract.updated_at,
    status: contract.status,
    type: contract.type
  };
  
  return frontendContract;
};

/**
 * Convert a contract object from frontend format to API/DB format
 */
export const adaptContractToDb = (contract: any) => {
  return {
    id: contract.id,
    site_id: contract.siteId,
    client_id: contract.clientId,
    contract_number: contract.contractNumber,
    start_date: contract.startDate,
    end_date: contract.endDate,
    value: contract.value,
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
    updated_at: contract.updatedAt,
    status: contract.status,
    type: contract.type
  };
};

/**
 * Convert contract details object to format suitable for storing in the database
 */
export const adaptContractDetailsToDb = (contractDetails: any) => {
  return mapToDb(contractDetails);
};

/**
 * Convert contract details from DB format to frontend format
 */
export const adaptContractDetailsFromDb = (contractDetails: any) => {
  return mapFromDb(contractDetails);
};

/**
 * Alias functions for backward compatibility
 */
export const contractToDb = adaptContractToDb;
export const dbToContract = adaptContractToFrontend;
export const contractDetailsToDb = adaptContractDetailsToDb;
