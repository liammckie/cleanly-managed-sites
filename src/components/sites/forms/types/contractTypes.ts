
export type ContractTerm = {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew?: boolean;
  nextReviewDate?: string;
}

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
  cpiApplied?: boolean; // Whether CPI can be applied automatically
  cpiApplicationDate?: string; // Date when CPI should be applied
  terms: ContractTerm[];  // Multiple contract terms per site
  
  // Add legacy properties for compatibility
  renewalDate?: string;
  contractValue?: string;
  paymentTerms?: string;
  paymentFrequency?: string;
  contractType?: string;
  noticePeriod?: string;
  notes?: string;
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
