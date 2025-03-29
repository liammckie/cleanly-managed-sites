
import { Json } from './common';

// Base contract types
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
}

export interface ContractForecast {
  month: string;
  date: string;
  revenue: number;
  newContracts: number;
  expiringContracts: number;
  renewals: number;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: Json;
  created_at: string;
  created_by?: string;
  notes?: string;
  version_number: number;
}

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
  terms?: ContractTerm[];
  additionalContracts?: any[];
  contractType?: string;
  value?: number;
  billingCycle?: string;
  notes?: string;
  type?: string;
  status?: string;
}

export interface ContractTerm {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew: boolean;
  description?: string;
}
