
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
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  terminationPeriod?: string;
  renewalTerms?: string;
  autoRenewal?: boolean;
  noticePeriod?: string;
  contractType?: string;
  renewalType?: string;
  value?: number;
  status?: string;
  billingCycle?: string;
  nextReviewDate?: string;
  cpiApplied?: boolean;
  cpiApplicationDate?: string;
  terms?: ContractTerm[];
  notes?: string;
}

export interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface ContractSummary {
  totalValue: number;
  activeContracts: number;
  expiringWithin30Days: number;
  renewalRate: number;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  version: number;
  version_number?: number;
  contract_data: any;
  contract_details?: any;
  created_at: string;
  notes?: string;
  created_by?: string;
  is_active: boolean;
}

export type ContractType = 'fixed_term' | 'ongoing' | 'project_based' | 'retainer' | 'maintenance';
