
/**
 * Contract Types
 * Defines the data structures for contract information throughout the application
 */
import { Json } from './common';

export interface ContractTerm {
  id?: string;
  name: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
  description?: string;
  value?: number;
  type?: string;
}

export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalNoticeDays?: number;
  renewalLengthMonths?: number;
  reviewDate?: string;
  annualValue?: number;
  terminationClause?: string;
  noticePeriodDays?: number;
  nextIncreaseDate?: string;
  specialTerms?: string;
  
  // Additional properties
  value?: number;
  monthlyValue?: number;
  billingCycle?: string;
  contractType?: string;
  terminationPeriod?: string;
  renewalTerms?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  renewalPeriod?: string;
  renewalNotice?: number;
  noticeUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  notes?: string;
  terms?: ContractTerm[];
}

export interface DbContract {
  id: string;
  site_id: string;
  client_id: string;
  status?: string;
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  value?: number;
  monthly_value?: number;
  monthly_revenue?: number;
  auto_renewal?: boolean;
  renewal_period?: string;
  renewal_notice_days?: number;
  termination_period?: string;
  billing_cycle?: string;
  service_frequency?: string;
  service_delivery_method?: string;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
  contract_details?: Json;
}

export interface Contract {
  id: string;
  siteId: string;
  clientId: string;
  status?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  value?: number;
  monthlyValue?: number;
  monthlyRevenue?: number;
  autoRenewal?: boolean;
  renewalPeriod?: string;
  renewalNoticeDays?: number;
  terminationPeriod?: string;
  billingCycle?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
  contractDetails?: ContractDetails;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: ContractDetails;
  notes?: string;
  created_at: string;
  version_number: number;
  created_by?: string;
}

export interface ContractSummaryData {
  totalContracts: number;
  activeContracts: number;
  expiringThisMonth: number;
  expiringNextQuarter: number;
  totalValue: number;
  renewalsThisMonth: number;
}

export interface ContractData {
  id: string;
  contractNumber: string;
  client: string;
  site: string;
  startDate: string;
  endDate: string;
  status: string;
  value: number;
}

export interface GroupedContracts {
  [key: string]: Contract[];
}

export interface ContractorChange {
  id?: string;
  date: string;
  description: string;
  contractor: string;
  site: string;
}

export interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
  contractCount?: number;
  activeContracts?: number;
  expiringContracts?: number;
  renewingContracts?: number;
}

export interface ContractActivity {
  id: string;
  date: string;
  type: string;
  description: string;
  user: string;
  contract: string;
}
