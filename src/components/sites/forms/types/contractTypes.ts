
import { JsonValue } from '@/types/common';

export interface ContractDetails {
  startDate?: string;
  endDate?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  autoRenewal?: boolean;
  renewalPeriod?: number;
  renewalNotice?: number;
  noticeUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  additionalContracts?: any[];
  // Additional fields needed by components
  contractNumber?: string;
  contractType?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  notes?: string;
  value?: number;
  billingCycle?: string;
  terms?: ContractTerm[];
  id?: string; // Used in some components
}

export interface ContractTerm {
  id: string;
  description: string;
  isActive: boolean;
  required: boolean;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: JsonValue;
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
