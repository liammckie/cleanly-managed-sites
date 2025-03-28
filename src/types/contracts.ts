
import { ContractStatus, Json } from './common';

/**
 * Contract data structure for API and components
 */
export interface ContractData {
  id: string;
  site_id?: string;
  site_name?: string;
  site?: {
    id: string;
    name: string;
  };
  client_id?: string;
  client_name?: string;
  client?: {
    id: string;
    name: string;
  };
  monthly_revenue?: number;
  value?: number;
  status: ContractStatus;
  contract_details?: Json;
  start_date?: string;
  end_date?: string;
  is_primary?: boolean;
}

/**
 * Contract summary data for dashboards and reports
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
  contracts: ContractData[];
}

/**
 * Contract details for forms and detailed views
 */
export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod: string;
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

/**
 * Contract term details
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
