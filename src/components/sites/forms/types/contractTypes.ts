
import { SiteStatus } from '@/types/common';

export interface ContractTerm {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew: boolean;
  description?: string; // Added description property
}

export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalNoticeDays?: number;
  renewalLengthMonths?: number;
  reviewDate?: string;
  annualValue?: number;
  terminationClause?: string;
  noticePeriodDays?: number;
  nextIncreaseDate?: string;
  specialTerms?: string;
  
  // Additional properties needed in different components
  value?: number;
  billingCycle?: string;
  contractType?: string;
  terminationPeriod?: string;
  renewalTerms?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  renewalPeriod?: number;
  renewalNotice?: number;
  noticeUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  notes?: string;
  terms?: ContractTerm[];
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: ContractDetails;
  created_at: string;
  notes?: string;
  version_number: number;
  created_by?: string;
}

export interface ContractSummary {
  totalContracts: number;
  activeContracts: number;
  expiringThisMonth: number;
  expiringNext3Months: number;
  expiringNext6Months: number;
  totalValue: number;
}

export interface ContractForecast {
  month: string;
  revenue: number;
  contractCount: number;
  activeContracts?: number;
  expiringContracts?: number;
  renewingContracts?: number;
  // Adding properties required by the ContractForecast type in other files
  cost: number;
  profit: number;
  // Additional properties
  id?: string;
  startDate?: string;
  endDate?: string;
  value?: number;
}
