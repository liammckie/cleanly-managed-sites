
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
}
