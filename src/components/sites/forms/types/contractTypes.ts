
import { SiteStatus } from '@/types/common';

export interface ContractTerm {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew: boolean;
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
}
