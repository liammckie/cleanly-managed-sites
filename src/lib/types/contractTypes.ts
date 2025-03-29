
/**
 * Contract related type definitions
 */
import { Json } from './common';

/**
 * Contract term details
 */
export interface ContractTerm {
  id: string;
  name: string;
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
 * Contract details structure
 */
export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: string | number;
  renewalNoticeDays?: number;
  terminationPeriod?: string;
  billingCycle?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  contractType?: string;
  value?: number;
  notes?: string;
  status?: string;
  terms?: ContractTerm[];
  noticeUnit?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  type?: string;
  renewalTerms?: string;
  reviewDate?: string;
  noticePeriodDays?: number;
  nextIncreaseDate?: string;
  specialTerms?: string;
  terminationClause?: string;
  annualValue?: number;
  renewalLengthMonths?: number;
}

/**
 * Contract record from database
 */
export interface Contract {
  id: string;
  site_id: string;
  client_id?: string;
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  value?: number;
  auto_renewal?: boolean;
  renewal_period?: string | number;
  renewal_notice_days?: number;
  termination_period?: string;
  billing_cycle?: string;
  contract_type?: string;
  service_frequency?: string;
  service_delivery_method?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  status?: string;
  monthly_revenue?: number;
  contract_details?: Json;
  is_primary?: boolean;
  // Frontend-compatible properties
  siteId?: string;
  clientId?: string;
  siteName?: string;
  clientName?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: string | number;
  renewalNoticeDays?: number;
  terminationPeriod?: string;
  billingCycle?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  monthlyRevenue?: number;
  contractDetails?: any;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
  contractType?: string;
  type?: string;
}

/**
 * Contract history entry
 */
export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: Json;
  version_number: number;
  notes?: string;
  created_by?: string;
  created_at: string;
}

/**
 * Contract summary data for analytics
 */
export interface ContractSummaryData {
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  totalValue: number;
  totalContracts: number;
  expiringWithin30Days: number;
  expiringThisMonth: number;
  expiringNext3Months: number;
  expiringNext6Months: number;
  expiringThisYear: number;
  valueExpiringThisMonth: number;
  valueExpiringNext3Months: number;
  valueExpiringNext6Months: number;
  valueExpiringThisYear: number;
  profitMargin: number;
  avgContractValue: number;
  expiredCount?: number;
  renewalRate?: number;
  id?: string;
}

/**
 * Contract activity record
 */
export interface ContractActivity {
  id: string;
  contract_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  created_by?: string;
  metadata?: Json;
  details?: Json;
  // Frontend-compatible properties
  contractId?: string;
  action?: string;
  timestamp?: string;
  userName?: string;
}

/**
 * Grouped contracts by status
 */
export interface GroupedContracts {
  active?: Contract[];
  expiring?: Contract[];
  expired?: Contract[];
  renewing?: Contract[];
  [key: string]: Contract[] | undefined;
}
