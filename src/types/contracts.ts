
// Re-export contract types from the central registry
export type { 
  Contract, 
  DbContract, 
  ContractDetailsForm, 
  ContractTerm,
  ContractSummary,
  ContractForecast,
  ContractActivity
} from './db';

import { Contract, ContractTerm } from './db';
import { ContractStatus, Json } from './common';

/**
 * Contract data structure for API and components
 * @deprecated Use Contract from the central registry instead
 */
export interface ContractData extends Contract {}

/**
 * Contract summary data for dashboards and reports
 * @deprecated Use ContractSummary from the central registry instead
 */
export interface ContractSummaryData {
  total_count: number;
  active_count: number;
  expiring_soon_count: number;
  monthly_revenue: number;
  annual_revenue: number;
}

/**
 * Grouped contracts by client or status
 */
export interface GroupedContracts {
  label: string;
  count: number;
  value: number;
  contracts: Contract[];
}

/**
 * Contract details for forms and detailed views
 * @deprecated Use ContractDetailsForm from the central registry instead
 */
export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: string;
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
