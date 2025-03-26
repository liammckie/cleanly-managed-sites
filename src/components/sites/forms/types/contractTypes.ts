
import { JsonValue } from '@/types';

export interface ContractTerm {
  id: string;
  description: string;
  details: string;
  isActive: boolean;
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface ContractDetails {
  startDate: string;
  endDate: string;
  contractLength: number;
  contractLengthUnit: string;
  autoRenewal: boolean;
  renewalPeriod: number;
  renewalNotice: number;
  noticeUnit: string;
  serviceFrequency: string;
  serviceDeliveryMethod: string;
  terms?: ContractTerm[];
  contractNumber?: string;
  value?: number;
  billingCycle?: string;
  terminationPeriod?: string;
  renewalTerms?: string;
  additionalContracts?: ContractDetails[];
  contractType?: string;  // Added for additional contract support
  notes?: string;        // Added for additional contract support
  id?: string;           // Added for additional contract support
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: JsonValue;
  notes: string;
  created_by: string;
  created_at: string;
  version_number: number;
}

export interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}
