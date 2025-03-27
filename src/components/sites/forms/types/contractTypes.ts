export interface ContractTerm {
  id?: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
}

export interface ContractHistoryEntry {
  id?: string;
  siteId: string;
  contractDetails: any;
  timestamp: string;
  notes?: string;
}

// Add the ContractForecast type definition
export interface ContractForecast {
  id?: string;
  month: string;
  revenue: number;
  cost: number;
  profit: number;
  startDate?: string;
  endDate?: string;
  value?: number;
}

export interface ContractDetails {
  type?: string;
  contractType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  reviewDate?: string;
  autoRenewal?: boolean;
  renewalNoticeDays?: number;
  renewalLengthMonths?: number;
  contractNumber?: string;
  annualValue?: number;
  value?: number;
  billingCycle?: string;
  notes?: string;
  customFields?: Record<string, any>;
  terms?: ContractTerm[];
  id?: string;
}
