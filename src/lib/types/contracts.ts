
import { Json } from '@/lib/utils/json';

/**
 * Contract data with information about the site and client
 */
export interface ContractData {
  id: string;
  site_id: string;
  site_name: string;
  client_id: string;
  client_name: string;
  contract_details: Json;
  monthly_revenue: number;
  status: string;
  is_primary: boolean;
}

/**
 * Contract forecast item for expirations
 */
export interface ContractForecastItem {
  siteId: string;
  siteName: string;
  clientId: string;
  clientName: string;
  contractNumber: string;
  endDate: string;
  monthlyValue: number;
  expiringIn: number;
  isAdditionalContract?: boolean;
}

/**
 * Summary data for contract expirations and values
 */
export interface ContractSummaryData {
  expiringThisMonth: number;
  expiringNext3Months: number;
  expiringNext6Months: number;
  expiringThisYear: number;
  valueExpiringThisMonth: number;
  valueExpiringNext3Months: number;
  valueExpiringNext6Months: number;
  valueExpiringThisYear: number;
  totalContracts: number;
  totalValue: number;
}

/**
 * Contract forecast data by month
 */
export interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

/**
 * Contract summary metrics
 */
export interface ContractSummary {
  totalValue: number;
  activeContracts: number;
  expiringWithin30Days: number;
  renewalRate: number;
}
