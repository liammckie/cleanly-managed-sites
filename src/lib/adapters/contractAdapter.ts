
import { Contract } from '@/types/db';
import { ContractData, ContractDetails } from '@/types/contracts';

/**
 * Adapts a DB contract object to the frontend ContractData format
 */
export function adaptContractFromDb(contract: Contract): ContractData {
  return {
    id: contract.id,
    site_id: contract.site_id,
    client_id: contract.client_id,
    contract_number: contract.contract_number,
    start_date: contract.start_date,
    end_date: contract.end_date,
    value: contract.value,
    auto_renewal: contract.auto_renewal,
    renewal_period: contract.renewal_period,
    renewal_notice_days: contract.renewal_notice_days,
    termination_period: contract.termination_period,
    billing_cycle: contract.billing_cycle,
    contract_type: contract.contract_type,
    service_frequency: contract.service_frequency,
    service_delivery_method: contract.service_delivery_method,
    created_at: contract.created_at,
    updated_at: contract.updated_at,
    notes: contract.notes,
    status: contract.status
  };
}

/**
 * Adapts a DB contract to the frontend ContractDetails format
 */
export function adaptContractToDetails(contract: Contract): ContractDetails {
  return {
    id: contract.id,
    contractNumber: contract.contract_number,
    startDate: contract.start_date,
    endDate: contract.end_date,
    autoRenewal: contract.auto_renewal,
    renewalPeriod: contract.renewal_period,
    renewalNoticeDays: contract.renewal_notice_days,
    terminationPeriod: contract.termination_period,
    billingCycle: contract.billing_cycle,
    serviceFrequency: contract.service_frequency,
    serviceDeliveryMethod: contract.service_delivery_method,
    contractType: contract.contract_type,
    value: contract.value,
    notes: contract.notes,
    status: contract.status
  };
}

/**
 * Adapts a frontend ContractDetails to the DB Contract format
 */
export function adaptContractDetailsToDb(details: ContractDetails, siteId: string): Partial<Contract> {
  return {
    site_id: siteId,
    contract_number: details.contractNumber,
    start_date: details.startDate,
    end_date: details.endDate,
    auto_renewal: details.autoRenewal,
    renewal_period: details.renewalPeriod,
    renewal_notice_days: details.renewalNoticeDays,
    termination_period: details.terminationPeriod,
    billing_cycle: details.billingCycle,
    service_frequency: details.serviceFrequency,
    service_delivery_method: details.serviceDeliveryMethod,
    contract_type: details.contractType,
    value: details.value,
    notes: details.notes,
    status: details.status
  };
}
