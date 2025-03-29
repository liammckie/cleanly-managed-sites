
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
  revenue?: number; // Added to fix errors in useContractForecast.ts
}

export interface ContractTerm {
  id: string; // Changed to required to match import in lib/api/contracts.ts
  name: string;
  description?: string;
  value?: number | string;
  unit?: string;
  type?: string;
  // Add properties used in ContractTermsSection.tsx
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
}

export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: string;
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
  noticeUnit?: string; // Added to fix error in contractDataUtils.ts
  contractLength?: number; // Added to fix error in contractDataUtils.ts
}

export interface ContractActivity {
  id: string;
  contract_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  created_by?: string;
  metadata?: Json;
  // Add missing properties used in ContractActivityFeed.tsx
  action?: string;
  timestamp?: string;
  userName?: string;
  details?: any;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: Json;
  notes?: string;
  created_at: string;
  created_by?: string;
  version_number: number;
}
