
export interface ContractSummary {
  totalValue: number;
  expiringWithin30Days: number;
  renewalRate: number;
}

export interface ContractTerm {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
  value?: number | string;
  type?: string;
}
