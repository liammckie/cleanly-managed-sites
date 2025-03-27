
import { SiteStatus } from '@/types/common';

// Adding Json type since it's missing
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

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

export interface GroupedContracts {
  [key: string]: ContractData[];
}

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
