
import { SiteStatus } from './common';
import { Json } from './common';

export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: number;
  renewalNoticeDays?: number;
  noticeUnit?: string;
  terminationPeriod?: string;
  renewalTerms?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  terms?: any[];
  additionalContracts?: any[];
  contractType?: string;
  value?: number;
  billingCycle?: string;
  notes?: string;
  type?: string;
  status?: string;
}

export interface ContractData {
  id: string;
  client: {
    id: string;
    name: string;
  };
  site: {
    id: string;
    name: string;
  };
  value: number;
  startDate: string;
  endDate: string;
  status: string;
  site_id?: string;
  site_name?: string;
  client_id?: string;
  client_name?: string;
  monthly_revenue?: number;
  contract_details?: any;
  start_date?: string;
  end_date?: string;
  is_primary?: boolean;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: Json;
  version_number: number;
  notes?: string;
  created_by?: string;
  created_at: string;
}
