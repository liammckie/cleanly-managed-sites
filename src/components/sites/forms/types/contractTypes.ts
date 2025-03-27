
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
  id?: string;
  startDate?: string;
  endDate?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  autoRenewal?: boolean;
  renewalPeriod?: number;
  renewalNotice?: number;
  noticeUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  contractNumber?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  contractType?: string;
  value?: number;
  billingCycle?: string;
  notes?: string;
  terms?: ContractTerm[];
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: any;
  version_number: number;
  notes: string;
  created_by: string;
  created_at: string;
  date: string;
  user: string;
  changes: any;
  contractor_id?: any;
}

export interface ContractForecast {
  id: string;
  startDate: string;
  endDate: string;
  value: number;
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}
