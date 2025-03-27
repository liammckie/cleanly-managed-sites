
export interface ContractTerm {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew: boolean;
}

export interface ContractSummary {
  id?: string;
  totalValue: number;
  expiringWithin30Days: number;
  renewalRate: number;
}

export interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface ContractDetails {
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: number;
  renewalNotice?: number;
  noticeUnit?: string;
  terminationPeriod?: string;
  contractType?: string;
  value?: number;
  frequency?: string;
  notes?: string;
  serviceDeliveryMethod?: string;
  renewalTerms?: string;
  contractLength?: number;
  contractLengthUnit?: string;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: ContractDetails;
  version_number: number;
  notes?: string;
  created_at: string;
  created_by?: string;
}
