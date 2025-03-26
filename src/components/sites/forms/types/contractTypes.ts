

export interface ContractTerm {
  id: string;
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
  contractLength: number;
  contractLengthUnit: 'days' | 'weeks' | 'months' | 'years';
  autoRenewal: boolean;
  renewalPeriod: number;
  renewalNotice: number;
  noticeUnit: string;
  serviceFrequency: string;
  serviceDeliveryMethod: string;
  // Optional fields for additional contracts
  contractNumber?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  contractType?: string;
  notes?: string;
  terms?: ContractTerm[];
  // For compatibility with existing DB-based interfaces
  id?: string;
  additionalContracts?: ContractDetails[];
  // Additional fields needed by ContractDetailsStep
  value?: number;
  billingCycle?: string;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: any;
  version_number: number;
  notes?: string;
  created_by?: string;
  created_at: string;
}

// Adding ContractForecast interface
export interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

