
import { Json } from './common';

/**
 * Contract model that follows the database schema (snake_case)
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
  contract_type?: string;
  type?: string;
}

/**
 * Contract model with camelCase properties for frontend use
 */
export interface Contract {
  id: string;
  siteId: string;
  clientId?: string;
  siteName?: string;
  clientName?: string;
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
  contractType?: string;
  type?: string;
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
  type?: string;
}

/**
 * Contract activity model
 */
export interface ContractActivity {
  id: string;
  contract_id: string;
  contractId?: string;
  activity_type: string;
  action?: string;
  description: string;
  created_at: string;
  createdAt?: string;
  created_by?: string;
  createdBy?: string;
  metadata?: Json;
  timestamp?: string;
  userName?: string;
  details?: any;
}

/**
 * Contract summary data
 */
export interface ContractSummaryData {
  id?: string;
  totalValue: number;
  expiringWithin30Days: number;
  renewalRate: number;
  activeCount?: number;
  pendingCount?: number;
  totalContracts?: number;
  expiringThisMonth?: number;
  expiringNext3Months?: number;
  expiringNext6Months?: number;
  valueExpiringThisMonth?: number;
  valueExpiringNext3Months?: number;
  valueExpiringNext6Months?: number;
}

/**
 * Contract history entry
 */
export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: Json;
  notes?: string;
  created_at: string;
  created_by?: string;
  version_number: number;
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
 * Contract forecast data for charts
 */
export interface ContractForecast {
  month: string;
  value: number;
  cumulative: number;
  revenue?: number;
  cost?: number;
  profit?: number;
  contractCount?: number;
  activeContracts?: number;
  expiringContracts?: number;
  renewingContracts?: number;
}

/**
 * Convert a database contract to a frontend contract
 */
export function dbToContract(dbContract: DbContract): Contract {
  return {
    id: dbContract.id,
    siteId: dbContract.site_id,
    clientId: dbContract.client_id,
    contractNumber: dbContract.contract_number,
    startDate: dbContract.start_date,
    endDate: dbContract.end_date,
    value: dbContract.value,
    monthlyRevenue: dbContract.monthly_revenue,
    contractDetails: dbContract.contract_details,
    autoRenewal: dbContract.auto_renewal,
    renewalPeriod: dbContract.renewal_period,
    renewalNoticeDays: dbContract.renewal_notice_days,
    terminationPeriod: dbContract.termination_period,
    billingCycle: dbContract.billing_cycle,
    serviceFrequency: dbContract.service_frequency,
    serviceDeliveryMethod: dbContract.service_delivery_method,
    isPrimary: dbContract.is_primary,
    createdAt: dbContract.created_at,
    updatedAt: dbContract.updated_at,
    status: dbContract.status,
    contractType: dbContract.contract_type || dbContract.type,
  };
}

/**
 * Convert a frontend contract to a database contract
 */
export function contractToDb(contract: Contract): DbContract {
  return {
    id: contract.id,
    site_id: contract.siteId,
    client_id: contract.clientId,
    contract_number: contract.contractNumber,
    start_date: contract.startDate,
    end_date: contract.endDate,
    value: contract.value,
    monthly_revenue: contract.monthlyRevenue,
    contract_details: contract.contractDetails,
    auto_renewal: contract.autoRenewal,
    renewal_period: contract.renewalPeriod,
    renewal_notice_days: contract.renewalNoticeDays,
    termination_period: contract.terminationPeriod,
    billing_cycle: contract.billingCycle,
    service_frequency: contract.serviceFrequency,
    service_delivery_method: contract.serviceDeliveryMethod,
    is_primary: contract.isPrimary,
    created_at: contract.createdAt,
    updated_at: contract.updatedAt,
    status: contract.status,
    contract_type: contract.contractType || contract.type,
  };
}
