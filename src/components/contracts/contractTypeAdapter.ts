
import { Contract } from '@/types/models';

/**
 * Adapt a contract object from database (snake_case) to app format (camelCase).
 */
export function adaptContract(dbContract: any): Contract {
  return {
    id: dbContract.id,
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
    
    // Camel case aliases for frontend use
    siteId: dbContract.site_id,
    clientId: dbContract.client_id,
    contractNumber: dbContract.contract_number,
    startDate: dbContract.start_date,
    endDate: dbContract.end_date,
    autoRenewal: dbContract.auto_renewal,
    renewalPeriod: dbContract.renewal_period,
    renewalNoticeDays: dbContract.renewal_notice_days,
    terminationPeriod: dbContract.termination_period,
    billingCycle: dbContract.billing_cycle,
    serviceFrequency: dbContract.service_frequency,
    serviceDeliveryMethod: dbContract.service_delivery_method,
    createdAt: dbContract.created_at,
    updatedAt: dbContract.updated_at,
    isPrimary: dbContract.is_primary
  };
}
