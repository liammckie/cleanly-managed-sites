
import { Json } from './common';

// Contract related types that were missing or causing errors
export interface ContractData {
  id: string;
  site_id: string;
  client_id?: string;
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  value?: number;
  auto_renewal?: boolean;
  renewal_period?: string | number;
  renewal_notice_days?: number;
  termination_period?: string;
  billing_cycle?: string;
  contract_type?: string;
  service_frequency?: string;
  service_delivery_method?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  status?: string;
}

export interface ContractSummaryData {
  id: string;
  totalValue: number;
  expiringWithin30Days: number;
  renewalRate: number;
}

export interface GroupedContracts {
  active: ContractData[];
  expiring: ContractData[];
  expired: ContractData[];
  renewing: ContractData[];
}

export interface ContractForecast {
  month: string;
  value: number;
  cumulative: number;
}

export interface ContractTerm {
  id: string;
  name: string;
  description?: string;
  value?: number | string;
  unit?: string;
  type?: string;
}

export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: string | number;
  renewalNoticeDays?: number;
  terminationPeriod?: string;
  billingCycle?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  contractType?: string;
  value?: number;
  notes?: string;
  status?: string;
  terms?: ContractTerm[];
}
