
import { Json } from './common';

/**
 * Contract lifecycle status
 */
export type ContractStatus = 'draft' | 'active' | 'pending' | 'expired' | 'canceled' | 'renewed' | 'terminated';

/**
 * Contract type
 */
export type ContractType = 'service' | 'maintenance' | 'one-time' | 'project' | 'other';

/**
 * Contract billing cycle
 */
export type ContractBillingCycle = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

/**
 * Contract model for API use
 */
export interface Contract {
  id: string;
  site_id: string;
  contract_number: string;
  contract_type: ContractType;
  status: ContractStatus;
  start_date: string;
  end_date: string;
  auto_renewal: boolean;
  renewal_notice_days: number;
  renewal_length_months: number;
  review_date?: string;
  annual_value: number;
  termination_clause?: string;
  notice_period_days: number;
  next_increase_date?: string;
  special_terms?: string;
  created_at: string;
  updated_at: string;
  details?: Json;
}

/**
 * Contract history entry
 */
export interface ContractHistoryEntry {
  id: string;
  contract_id: string;
  version_number: number;
  changes: Json;
  created_by: string;
  created_at: string;
  notes?: string;
}
