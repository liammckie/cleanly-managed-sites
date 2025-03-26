
import { BillingFrequency } from '@/types/common';

export interface ContractDetails {
  startDate?: string;
  endDate?: string;
  contractType?: string;
  contractNumber?: string;
  contractLength?: number;
  contractLengthUnit?: 'days' | 'weeks' | 'months' | 'years';
  autoRenewal?: boolean;
  renewalPeriod?: number;
  renewalNotice?: number;
  noticeUnit?: string;
  serviceFrequency?: BillingFrequency;
  serviceDeliveryMethod?: string;
  contractTerms?: ContractTerm[];
  additionalServices?: string[];
  notes?: string;
  // Additional properties needed for various components
  terminationPeriod?: string;
  renewalTerms?: string;
  value?: number;
  billingCycle?: string;
  id?: string;
  terms?: ContractTerm[];
  status?: string;
  type?: string;
  reviewDate?: string;
  noticePeriodDays?: number;
  renewalNoticeDays?: number;
  renewalLengthMonths?: number;
  nextIncreaseDate?: string;
  specialTerms?: string;
  terminationClause?: string;
  annualValue?: number;
}

export interface ContractTerm {
  id?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
  description?: string;
  value?: number;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: any; // Using 'any' instead of JsonValue
  notes?: string;
  created_at: string;
  created_by?: string;
  version_number: number;
}

export interface ContractForecast {
  month: string;
  value: number;
}

export interface ContractSummary {
  totalContracts: number;
  activeContracts: number;
  expiringContracts: number;
  avgContractValue: number;
}
