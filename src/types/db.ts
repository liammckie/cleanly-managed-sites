
// Central type registry for database entities
import { Json, BillingFrequency, ClientStatus, ContractStatus, UserStatus, SiteStatus } from './common';

/**
 * Contract entity as stored in the database
 */
export interface DbContract {
  id: string;
  site_id: string;
  client_id: string;
  status: ContractStatus;
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  value?: number;
  monthly_revenue?: number;
  contract_details?: Json;
  auto_renewal?: boolean;
  renewal_period?: string; // Changed from string | number to string
  renewal_notice_days?: number;
  termination_period?: string;
  billing_cycle?: BillingFrequency;
  service_frequency?: string;
  service_delivery_method?: string;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Contract entity with normalized field names for frontend use
 */
export interface Contract {
  id: string;
  siteId: string;
  siteName?: string;
  clientId: string;
  clientName?: string;
  status: ContractStatus;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  value?: number;
  monthlyRevenue?: number;
  contractDetails?: any;
  autoRenewal?: boolean;
  renewalPeriod?: string; // Changed from string | number to string
  renewalNoticeDays?: number;
  terminationPeriod?: string;
  billingCycle?: BillingFrequency;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Additional fields needed for UI components
  site?: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    name: string;
  };
}

/**
 * Contract details for form data
 */
export interface ContractDetailsForm {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: string; // Changed from string | number to string
  renewalNoticeDays?: number;
  noticeUnit?: string;
  terminationPeriod?: string;
  renewalTerms?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  terms?: ContractTerm[];
  additionalContracts?: any[];
  contractType?: string;
  value?: number;
  billingCycle?: BillingFrequency;
  notes?: string;
  type?: string;
  status?: ContractStatus;
}

/**
 * Contract term entry
 */
export interface ContractTerm {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew: boolean;
  description?: string;
}

/**
 * Contract summary for reporting
 */
export interface ContractSummary {
  totalCount: number;
  activeCount: number;
  expiringCount: number;
  totalValue: number;
  averageValue: number;
  expiringWithin30Days?: number;
  expiringThisMonth?: number;
  expiringNext3Months?: number;
  expiringNext6Months?: number;
  valueExpiringThisMonth?: number;
  valueExpiringNext3Months?: number;
  valueExpiringNext6Months?: number;
  profitMargin?: number;
}

/**
 * Contract forecast for financial projections
 */
export interface ContractForecast {
  month: string;
  contractCount: number;
  revenue: number;
  cost: number;
  profit: number;
  activeContracts?: number;
  expiringContracts?: number;
  renewingContracts?: number;
  id?: string;
  startDate?: string;
  endDate?: string;
  value?: number;
}

/**
 * Contract activity for the activity feed
 */
export interface ContractActivity {
  id: string;
  contractId: string;
  action: 'created' | 'updated' | 'renewed' | 'expired' | 'canceled';
  timestamp: string;
  userId?: string;
  userName?: string;
  details?: {
    oldValue?: any;
    newValue?: any;
    field?: string;
    notes?: string;
  };
}

/**
 * UserRole and permissions
 */
export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
}

export interface UserPermission {
  id: string;
  name: string;
  description?: string;
  module: string;
}

/**
 * User profile
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  title?: string;
  phone?: string;
  custom_id?: string;
  notes?: string;
  territories?: string[];
  status: UserStatus;
  role_id?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  daily_summary?: boolean;
}
