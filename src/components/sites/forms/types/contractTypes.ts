
export interface ContractTerm {
  id: string;
  title: string;
  content: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
  // Also include the alternative property names for compatibility
  name?: string;
  description?: string;
}

export interface ContractDetails {
  startDate: string;
  endDate: string;
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
  // Additional fields needed for compatibility
  date: string;
  user: string;
  changes: any;
  contractor_id?: any;
}
