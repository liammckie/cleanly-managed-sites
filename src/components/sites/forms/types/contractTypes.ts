
export type ContractDetails = {
  startDate: string;
  endDate: string;
  contractNumber: string;
  renewalTerms: string;
  terminationPeriod: string;
  value?: number;      // Monthly contract value
  billingCycle?: string; // Monthly, quarterly, annually
  autoRenew?: boolean;
  nextReviewDate?: string;
}

export type ContractHistoryEntry = {
  id: string;
  site_id: string;
  contract_details: ContractDetails;
  created_at: string;
  created_by?: string;
  version_number: number;
  notes?: string;
}

export type ContractForecast = {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export type ContractSummary = {
  totalValue: number;
  activeContracts: number;
  expiringWithin30Days: number;
  expiringWithin90Days: number;
  averageContractLength: number;
  renewalRate: number;
}
