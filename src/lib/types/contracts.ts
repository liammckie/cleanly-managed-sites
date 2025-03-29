
import { Json } from './common';

/**
 * Contract model that follows the database schema
 */
export interface DbContract {
  id: string;
  site_id: string;
  client_id?: string;
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  value?: number;
  monthly_revenue?: number;
  contract_details?: Json;
  auto_renewal?: boolean;
  renewal_period?: string;
  renewal_notice_days?: number;
  termination_period?: string;
  billing_cycle?: string;
  service_frequency?: string;
  service_delivery_method?: string;
  is_primary?: boolean;
  created_at: string;
  updated_at: string;
  status?: string;
}

/**
 * Contract model with camelCase properties for frontend use
 */
export interface Contract {
  id: string;
  siteId: string;
  clientId?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  value?: number;
  monthlyRevenue?: number;
  contractDetails?: any;
  autoRenewal?: boolean;
  renewalPeriod?: string;
  renewalNoticeDays?: number;
  terminationPeriod?: string;
  billingCycle?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  isPrimary?: boolean;
  createdAt: string;
  updatedAt: string;
  status?: string;
}

/**
 * Contract term model
 */
export interface ContractTerm {
  id?: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
}

/**
 * Contract details model
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
  contractType?: string;
  value?: number;
  billingCycle?: string;
  notes?: string;
  status?: string;
}
