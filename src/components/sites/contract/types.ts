
import { ContractData, ContractSummaryData, GroupedContracts } from '@/types/contracts';

/**
 * Re-export the contract types from lib/types/contracts for consistency
 */
export type { ContractData, ContractSummaryData, GroupedContracts };

/**
 * Types for the contract-related components
 */
export interface ContractTerm {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew: boolean;
  description?: string;
}

export interface ContractSummary {
  id?: string;
  totalValue: number;
  expiringWithin30Days: number;
  renewalRate: number;
}

export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: number;
  renewalNoticeDays?: number;
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
  value?: number;
  billingCycle?: string;
  notes?: string;
  type?: string;
  status?: string;
}

export interface ContractDetailsDTO {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod: string; // Must be string in DTO
  renewalNoticeDays?: number;
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
  value?: number;
  billingCycle?: string;
  notes?: string;
  type?: string;
  status?: string;
}
