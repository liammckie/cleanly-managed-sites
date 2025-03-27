
import { SiteStatus, Json } from './common';

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
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  totalValue: number;
  
  // Add missing fields for metrics and totals
  totalContracts: number;
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
  
  // Additional metrics
  avgContractValue?: number;
  renewalRate?: number;
  expiringCount?: number;
}

export interface GroupedContracts {
  [key: string]: ContractData[];
}

export interface ContractForecast {
  startDate?: string;
  endDate?: string;
  value?: number;
  id?: string;
  // Required fields to match the type
  month: string;
  revenue: number;
  cost: number;
  profit: number;
  contractCount?: number;
  activeContracts?: number;
  expiringContracts?: number;
  renewingContracts?: number;
}
