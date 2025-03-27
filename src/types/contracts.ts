
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

/**
 * Contract data for UI representation
 */
export interface ContractData {
  id: string;
  client: {
    id: string;
    name: string;
  };
  site: {
    id: string;
    name: string;
  };
  value: number;
  startDate: string;
  endDate: string;
  status: string;
  
  // Additional fields needed by components
  site_id?: string;
  site_name?: string;
  client_id?: string;
  client_name?: string;
  monthly_revenue?: number;
  contract_details?: any;
  
  // For backward compatibility
  start_date?: string;
  end_date?: string;
  
  // Add the is_primary field that was referenced in contractAdapter.ts
  is_primary?: boolean;
}

/**
 * Contract summary data for dashboard metrics
 */
export interface ContractSummaryData {
  totalContracts: number;
  activeCount: number;
  pendingCount: number;
  totalValue: number;
  
  // Add totalCount for backward compatibility
  totalCount: number;
  
  // Add missing fields for expiry metrics
  expiringWithin30Days: number;
  expiringThisMonth: number;
  expiringNext3Months: number;
  expiringNext6Months: number;
  expiringThisYear: number;
  
  // Add missing fields for value metrics
  valueExpiringThisMonth: number;
  valueExpiringNext3Months: number;
  valueExpiringNext6Months: number;
  valueExpiringThisYear: number;
  
  // Add missing fields for totals
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
}

/**
 * Grouped contracts by category
 */
export interface GroupedContracts {
  [key: string]: ContractData[];
}

/**
 * Contract forecast for revenue projections
 */
export interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
  contractCount?: number;
  activeContracts?: number;
  expiringContracts?: number;
  renewingContracts?: number;
  
  // Additional optional fields that may be used
  startDate?: string;
  endDate?: string;
  value?: number;
  id?: string;
}
