
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
  startDate: string;
  endDate: string;
  contractNumber: string;
  renewalTerms: string;
  terminationPeriod: string;
  renewalDate?: string;
  contractValue?: string;
  paymentTerms?: string;
  paymentFrequency?: string;
  contractType?: string;
  noticePeriod?: string;
  notes?: string;
  terms?: ContractTerm[];
  value?: number;
  billingCycle?: BillingFrequency;
  autoRenew?: boolean;
  cpiApplied?: boolean;
  cpiApplicationDate?: string;
  nextReviewDate?: string;
}
