
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
