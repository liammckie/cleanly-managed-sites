
import { BillingFrequency } from './billingTypes';

export interface ContractTerm {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew: boolean;
}

export interface ContractDetails {
  startDate: string;
  endDate: string;
  contractNumber: string;
  renewalTerms: string;
  terminationPeriod: string;
  renewalDate?: string;
  contractValue?: string;
  paymentTerms?: string;
  paymentFrequency?: string;
  contractType?: string;
  noticePeriod?: string;
  notes?: string;
  terms?: ContractTerm[];
  value?: number;
  billingCycle?: BillingFrequency;
  autoRenew?: boolean;
  cpiApplied?: boolean;
  cpiApplicationDate?: string;
  nextReviewDate?: string;
}

// Add these missing types that are referenced elsewhere
export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: ContractDetails;
  version_number: number;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export interface ContractForecast {
  month: string;
  value: number;
  revenue?: number;
  cost?: number;
  profit?: number;
  date?: Date;
}

export interface ContractSummary {
  totalValue: number;
  activeContracts: number;
  expiringContracts: number;
  avgContractValue: number;
  expiringWithin30Days?: number;
  expiringWithin90Days?: number;
  averageContractLength?: number;
  renewalRate?: number;
}
