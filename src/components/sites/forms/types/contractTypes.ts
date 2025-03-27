
export interface ContractTerm {
  id: string;
  title: string;
  content: string;
  description?: string;
}

export interface ContractDetails {
  startDate?: string;
  endDate?: string;
  contractType?: string;
  contractNumber?: string;
  autoRenew?: boolean;
  terminationPeriod?: string;
  renewalTerms?: string;
  billingCycle?: string;
  notes?: string;
  terms?: ContractTerm[];
  value?: number;
  id?: string;
  serviceFrequency?: string;
}

export interface ContractHistoryEntry {
  id: string;
  date: string;
  user: string;
  changes: string;
  notes?: string;
  
  // Additional fields for DB compatibility
  site_id?: string;
  contract_details?: any;
  version_number?: number;
  created_by?: string;
  created_at?: string;
  contractor_id?: string;
}
