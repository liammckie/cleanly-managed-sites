
import { ContractData } from '@/types/contracts';
import { Json } from '@/types/common';
import { asJsonObject } from '@/lib/utils/json';

export function convertContractDetails(contractDetails: string | number | boolean | { [key: string]: Json } | Json[] | null): any {
  if (!contractDetails) {
    return {
      contractNumber: '',
      startDate: '',
      endDate: '',
      autoRenewal: false,
      renewalPeriod: 0,
      renewalNotice: 0,
      noticeUnit: 'days',
      terminationPeriod: ''
    };
  }
  
  if (typeof contractDetails === 'object') {
    return contractDetails;
  }
  
  try {
    if (typeof contractDetails === 'string') {
      return JSON.parse(contractDetails);
    }
    return {};
  } catch (e) {
    return {
      contractNumber: '',
      startDate: '',
      endDate: '',
      autoRenewal: false,
      renewalPeriod: 0,
      renewalNotice: 0,
      noticeUnit: 'days',
      terminationPeriod: ''
    };
  }
}

export function adaptContract(rawContract: any): ContractData {
  return {
    id: rawContract.id,
    site_id: rawContract.site_id,
    site_name: rawContract.site_name,
    client_id: rawContract.client_id,
    client_name: rawContract.client_name,
    monthly_revenue: rawContract.monthly_revenue || 0,
    status: rawContract.status,
    is_primary: rawContract.is_primary,
    contract_details: convertContractDetails(rawContract.contract_details)
  };
}

export function adaptContracts(rawContracts: any[]): ContractData[] {
  return rawContracts.map(adaptContract);
}
