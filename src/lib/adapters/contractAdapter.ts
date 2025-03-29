
import { Contract } from '@/types/db';
import { ContractDetails } from '@/types/contracts';

export const adaptContractDetailsToDb = (contractDetails: ContractDetails): any => {
  if (!contractDetails) return null;
  
  return {
    contract_number: contractDetails.contractNumber,
    start_date: contractDetails.startDate,
    end_date: contractDetails.endDate,
    auto_renewal: contractDetails.autoRenewal,
    renewal_period: contractDetails.renewalPeriod,
    renewal_notice_days: contractDetails.renewalNoticeDays,
    termination_period: contractDetails.terminationPeriod,
    billing_cycle: contractDetails.billingCycle,
    service_frequency: contractDetails.serviceFrequency,
    service_delivery_method: contractDetails.serviceDeliveryMethod,
    contract_type: contractDetails.contractType,
    value: contractDetails.value,
    notes: contractDetails.notes,
    status: contractDetails.status
  };
};

export const dbToContract = (dbContract: Contract): any => {
  if (!dbContract) return null;
  
  return {
    id: dbContract.id,
    siteId: dbContract.site_id,
    siteName: dbContract.site?.name,
    clientId: dbContract.client_id,
    clientName: dbContract.client?.name,
    status: dbContract.status,
    contractNumber: dbContract.contract_number,
    startDate: dbContract.start_date,
    endDate: dbContract.end_date,
    value: dbContract.value,
    monthlyRevenue: dbContract.monthly_revenue,
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
};
