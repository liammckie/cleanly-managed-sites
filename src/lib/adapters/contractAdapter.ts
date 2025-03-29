
/**
 * Contract Adapter
 * Provides functions to convert between frontend and backend contract formats
 */
import { Json } from '@/lib/types/common';
import { Contract, ContractDetails, ContractTerm } from '@/lib/types/contractTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * Adapts a contract from database format to frontend format
 */
export function adaptContractFromDb(dbContract: any): Contract {
  if (!dbContract) return {} as Contract;
  
  return {
    id: dbContract.id || '',
    site_id: dbContract.site_id || '',
    client_id: dbContract.client_id || '',
    title: dbContract.title || '',
    contractNumber: dbContract.contract_number || '',
    description: dbContract.description || '',
    type: dbContract.contract_type || '',
    status: dbContract.status || 'draft',
    monthlyRevenue: dbContract.monthly_revenue || 0,
    contractDetails: dbContract.contract_details || {},
    startDate: dbContract.start_date || '',
    endDate: dbContract.end_date || '',
    renewalPeriod: dbContract.renewal_period || '',
    autoRenewal: dbContract.auto_renewal || false,
    value: dbContract.value || 0,
    billingCycle: dbContract.billing_cycle || 'monthly',
    serviceFrequency: dbContract.service_frequency || '',
    serviceDeliveryMethod: dbContract.service_delivery_method || '',
    isPrimary: dbContract.is_primary || false,
    created_at: dbContract.created_at || '',
    updated_at: dbContract.updated_at || '',
  };
}

/**
 * Adapts a contract from frontend format to database format
 */
export function adaptContractToDb(contract: Contract): any {
  return {
    id: contract.id || uuidv4(),
    site_id: contract.site_id || '',
    contract_number: contract.contractNumber || '',
    contract_type: contract.type || '',
    status: contract.status || 'draft',
    monthly_revenue: contract.monthlyRevenue || 0,
    contract_details: contract.contractDetails || {},
    start_date: contract.startDate || '',
    end_date: contract.endDate || '',
    renewal_period: contract.renewalPeriod || '',
    auto_renewal: contract.autoRenewal || false,
    value: contract.value || 0,
    billing_cycle: contract.billingCycle || 'monthly',
    service_frequency: contract.serviceFrequency || '',
    service_delivery_method: contract.serviceDeliveryMethod || '',
    is_primary: contract.isPrimary || false,
  };
}

/**
 * Adapts contract details from frontend format to database format
 */
export function adaptContractDetailsToDb(details: ContractDetails): Json {
  // Convert dates to ISO strings
  const { startDate, endDate, ...rest } = details;
  
  return {
    ...rest,
    startDate: startDate ? new Date(startDate).toISOString() : null,
    endDate: endDate ? new Date(endDate).toISOString() : null,
  } as Json;
}

/**
 * Adapts contract details from database format to frontend format
 */
export function adaptContractDetailsFromDb(dbDetails: Json): ContractDetails {
  if (!dbDetails) return {} as ContractDetails;
  
  // Ensure contract terms have proper IDs
  const terms = Array.isArray(dbDetails.terms) 
    ? dbDetails.terms.map((term: any) => ({
        ...term,
        id: term.id || uuidv4() 
      }))
    : [];
  
  return {
    ...dbDetails as any,
    terms
  } as ContractDetails;
}

/**
 * Adapts contract details to JSON for API export
 */
export function adaptContractDetailsToJson(details: ContractDetails): string {
  return JSON.stringify(details);
}
