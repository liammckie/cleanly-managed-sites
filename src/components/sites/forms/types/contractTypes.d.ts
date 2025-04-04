
/**
 * Types for contract-related data in the site form
 */

export interface ContractTerm {
  id: string;
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
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
  renewalTerms?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  terms?: ContractTerm[];
  additionalContracts?: any[];
  contractType?: string;
  
  // Additional properties used in components
  value?: number;
  billingCycle?: string;
  notes?: string;
  id?: string; // Used in additionalContractsApi
  
  // Additional properties for contract details step
  type?: string;
  status?: string;
  reviewDate?: string;
  noticePeriodDays?: number;
  nextIncreaseDate?: string;
  specialTerms?: string;
  terminationClause?: string;
  annualValue?: number;
  renewalNoticeDays?: number;
  renewalLengthMonths?: number;
}

export interface ContractHistoryEntry {
  id?: string;
  site_id: string;
  contract_details: any;
  notes?: string;
  created_at?: string;
  created_by?: string;
  version_number?: number;
}

export interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}
