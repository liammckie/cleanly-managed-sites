
import { Json } from './common';

// Base contract term definition
export interface ContractTerm {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
  value?: number | string; // Can be currency value or another unit
  type?: string;
}

// Contract details used in forms and detailed views
export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: string;
  renewalNoticeDays?: number;
  terminationPeriod?: string;
  value?: number;
  monthlyValue?: number;
  annualValue?: number;
  billingCycle?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  contractType?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  noticeUnit?: string;
  notes?: string;
  type?: string;
  status?: string;
  terms?: ContractTerm[];
  renewalTerms?: string;
  // Additional fields for supporting components
  contractorChanges?: ContractorChange[];
}

// Contract data structure for frontend use
export interface Contract {
  id: string;
  siteId: string;
  clientId: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  value: number;
  status: string;
  monthlyValue?: number;
  monthlyRevenue?: number;
  autoRenewal: boolean;
  renewalPeriod: string;
  renewalNoticeDays: number;
  terminationPeriod: string;
  serviceFrequency: string;
  serviceDeliveryMethod?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  contractDetails?: Json;
  billingCycle?: string;
  // Display properties
  siteName?: string;
  clientName?: string;
}

// Database interface for better type safety with Supabase
export interface DbContract {
  id: string;
  site_id: string;
  client_id: string;
  contract_number: string;
  start_date: string;
  end_date: string;
  value: number;
  status: string;
  monthly_value?: number;
  monthly_revenue?: number;
  auto_renewal: boolean;
  renewal_period: string;
  renewal_notice_days: number;
  termination_period: string;
  service_frequency: string;
  service_delivery_method?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  contract_details?: Json;
  billing_cycle?: string;
}

// Contract summary data for dashboard displays
export interface ContractSummaryData {
  activeCount: number;
  pendingCount: number;
  totalContracts: number;
  totalValue: number;
  expiringWithin30Days: number;
  expiringThisMonth?: number;
  valueExpiringThisMonth?: number;
  expiringNext3Months?: number;
  valueExpiringNext3Months?: number;
}

// Contract history entry for tracking changes
export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: Json;
  notes?: string;
  created_at: string;
  created_by?: string;
  version_number: number;
}

// Used for charts and data display
export interface ContractData {
  id: string;
  site_id: string;
  client_id?: string;
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  value?: number;
  monthly_value?: number;
  monthly_revenue?: number;
  status?: string;
  auto_renewal?: boolean;
  renewal_period?: string;
  renewal_notice_days?: number;
  termination_period?: string;
  billing_cycle?: string;
  service_frequency?: string;
  service_delivery_method?: string;
  created_at?: string;
  updated_at?: string;
}

// Group contracts by status for display
export interface GroupedContracts {
  active: ContractData[];
  expiring: ContractData[];
  expired: ContractData[];
  renewing: ContractData[];
}

// Track contractor changes in contracts
export interface ContractorChange {
  previousContractorId?: string;
  previousContractorName?: string;
  newContractorId: string;
  newContractorName: string;
  transitionDate: string;
  reason: string;
}

// Contract forecast data for charts
export interface ContractForecast {
  month: string;
  value: number;
  cumulative: number;
  revenue?: number;
  cost?: number;
  profit?: number;
}

export interface ContractActivity {
  id: string;
  contract_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  created_by?: string;
  metadata?: Json;
  action?: string;
  timestamp?: string;
  userName?: string;
  details?: any;
}
