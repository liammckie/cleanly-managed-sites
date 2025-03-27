
export interface ContractTerm {
  id?: string;
  title?: string;
  content?: string;
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
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
  
  // Additional fields used by UI components
  contractLength?: number;
  contractLengthUnit?: string;
  renewalPeriod?: number;
  renewalNotice?: number;
  noticeUnit?: string;
  serviceDeliveryMethod?: string;
  autoRenewal?: boolean;  // For backward compatibility with autoRenew
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

export interface ContractForecast {
  startDate: string;
  endDate: string;
  value: number;
  id: string;
  
  // Make these required to match the expected type
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}
