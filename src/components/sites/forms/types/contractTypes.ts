
export interface ContractTerm {
  id?: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
}

export interface ContractHistoryEntry {
  id?: string;
  siteId: string;
  contractDetails: any;
  timestamp: string;
  notes?: string;
  site_id?: string; // For backward compatibility
  contract_details?: any; // For backward compatibility
  version_number?: number;
  created_by?: string;
  created_at?: string;
  contractor_id?: string;
  date?: string; // For display
  user?: string; // For display
  changes?: any; // For display
}

// Add the ContractForecast type definition with both old and new property sets
export interface ContractForecast {
  id?: string;
  month?: string;
  revenue?: number;
  cost?: number;
  profit?: number;
  // Add the properties used in useContractForecast
  startDate?: string;
  endDate?: string;
  value?: number;
}

export interface ContractDetails {
  type?: string;
  contractType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  reviewDate?: string;
  autoRenewal?: boolean;
  renewalNoticeDays?: number;
  renewalLengthMonths?: number;
  contractNumber?: string;
  annualValue?: number;
  value?: number;
  billingCycle?: string;
  notes?: string;
  customFields?: Record<string, any>;
  terms?: ContractTerm[];
  id?: string;
  // Add missing properties used across the codebase
  renewalTerms?: string;
  terminationPeriod?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  renewalPeriod?: number;
  renewalNotice?: number;
  noticeUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  // Additional properties for backward compatibility
  noticePeriodDays?: number;
  nextIncreaseDate?: string;
  specialTerms?: string;
  terminationClause?: string;
}
