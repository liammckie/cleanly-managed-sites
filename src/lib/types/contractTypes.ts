
/**
 * Contract related type definitions
 */
import { Json } from './common';

/**
 * Base contract information
 */
export interface Contract {
  id: string;
  contract_number?: string;
  type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  auto_renewal?: boolean;
  renewal_notice_days?: number;
  renewal_length_months?: number;
  renewal_period?: string;
  termination_period?: string;
  termination_notice_days?: number;
  value?: number;
  monthly_value?: number;
  annual_value?: number;
  payment_terms?: string;
  billing_frequency?: string;
  service_frequency?: string;
  service_delivery_method?: string;
  is_primary?: boolean;
  created_at: string;
  updated_at: string;
  site_id?: string;
  client_id?: string;
}

/**
 * Extended contract details
 */
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
  renewalPeriod?: string | number;
  terminationPeriod?: string;
  terminationNoticeDays?: number;
  value?: number;
  monthlyValue?: number;
  annualValue?: number;
  paymentTerms?: string;
  billingFrequency?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  isPrimary?: boolean;
  notes?: string;
  attachments?: any[];
  terms?: ContractTerm[];
  specialClauses?: string;
  nextReviewDate?: string;
  lastReviewDate?: string;
}

/**
 * Contract term item
 */
export interface ContractTerm {
  id: string;
  description: string;
  value?: any;
  isRequired?: boolean;
}

/**
 * Contract summary data for display
 */
export interface ContractSummaryData {
  status: string;
  startDate?: string;
  endDate?: string;
  value?: number;
  monthlyValue?: number;
  renewalStatus?: string;
  daysRemaining?: number;
  contractNumber?: string;
}

/**
 * Contract history entry
 */
export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  version_number: number;
  contract_details: ContractDetails;
  notes?: string;
  created_at: string;
  created_by?: string;
}

/**
 * Contract with site information 
 */
export interface ContractWithSite extends Contract {
  site_name?: string;
  client_name?: string;
  contract_details?: ContractDetails;
}
