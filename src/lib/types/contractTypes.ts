
/**
 * Contract related type definitions
 * Centralizes all contract types
 */
import { ContractStatus } from './common';

/**
 * Contract term interface
 */
export interface ContractTerm {
  id: string;
  term: string;
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
  value?: number | string;
  unit?: string;
  type?: string;
}

/**
 * Contract details interface
 */
export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  type?: string;
  status?: ContractStatus;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalNoticeDays?: number;
  renewalPeriod?: string;
  renewalLengthMonths?: number;
  terminationPeriod?: string;
  terminationPeriodDays?: number;
  value?: number;
  valueType?: string;
  valueFrequency?: string;
  termsOfPayment?: string;
  billingCycle?: string;
  billingDay?: number;
  lastBillingDate?: string;
  nextBillingDate?: string;
  contractLength?: string;
  contractLengthUnit?: string;
  contractLengthMonths?: number;
  renewalTerms?: string;
  notes?: string;
  terms?: ContractTerm[];
  noticeUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  reviewDate?: string;
  noticePeriodDays?: number;
  nextIncreaseDate?: string;
  specialTerms?: string;
  terminationClause?: string;
  annualValue?: number;
  renewalNotice?: number;
}

/**
 * Contract interface for frontend use
 */
export interface Contract {
  id: string;
  siteId: string;
  clientId?: string;
  contractNumber?: string;
  status: ContractStatus;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: string;
  renewalNoticeDays?: number;
  terminationPeriod?: string;
  value?: number;
  valueType?: string;
  valueFrequency?: string;
  termsOfPayment?: string;
  billingCycle?: string;
  contractLength?: string;
  renewalTerms?: string;
  notes?: string;
  terms?: ContractTerm[];
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
  contractDetails?: ContractDetails;
  monthlyRevenue?: number;
  
  // Legacy snake_case fields for backward compatibility
  site_id?: string;
  client_id?: string;
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  auto_renewal?: boolean;
  renewal_period?: string;
  renewal_notice_days?: number;
  termination_period?: string;
  billing_cycle?: string;
  contract_length?: string;
  service_frequency?: string;
  service_delivery_method?: string;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Contract data for database format
 */
export interface DbContract {
  id: string;
  site_id: string;
  client_id?: string;
  contract_number?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  auto_renewal?: boolean;
  renewal_period?: string;
  renewal_notice_days?: number;
  termination_period?: string;
  value?: number;
  value_type?: string;
  value_frequency?: string;
  terms_of_payment?: string;
  billing_cycle?: string;
  contract_length?: string;
  renewal_terms?: string;
  notes?: string;
  terms?: ContractTerm[];
  service_frequency?: string;
  service_delivery_method?: string;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
  contract_details?: any;
  monthly_revenue?: number;
}

/**
 * Contract history entry interface
 */
export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: any;
  notes?: string;
  created_at: string;
  created_by?: string;
  version_number: number;
}

/**
 * Contract activity interface
 */
export interface ContractActivity {
  id: string;
  contract_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  created_by?: string;
  metadata?: any;
  action?: string;
  timestamp?: string;
  userName?: string;
  details?: any;
}

/**
 * Grouped contracts by status
 */
export interface GroupedContracts {
  active: Contract[];
  expiring: Contract[];
  expired: Contract[];
  renewing: Contract[];
}

/**
 * Contract forecast data point
 */
export interface ContractForecast {
  month: string;
  value: number;
  cumulative: number;
  revenue?: number;
}
