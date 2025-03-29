
/**
 * Contract related type definitions
 */
import { Json } from './common';

export interface ContractTerm {
  id: string;
  description: string;
  value?: any;
  type?: string;
}

export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: string;
  renewalNoticeDays?: number;
  terminationPeriod?: string;
  value?: number;
  monthlyValue?: number;
  annualValue?: number;
  billingCycle?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  contractType?: string;
  contractLength?: string;
  contractLengthUnit?: string;
  noticeUnit?: string;
  notes?: string;
  type?: string;
  status?: string;
  terms?: ContractTerm[];
  renewalTerms?: string;
}

export interface ContractSummaryData {
  activeCount: number;
  pendingCount: number;
  totalContracts: number;
  totalValue: number;
  expiringWithin30Days: number;
  expiringThisMonth?: number;
  valueExpiringThisMonth?: number;
  expiringNext3Months?: number;
  valueExpiringNext3Months?: number;
}

export interface Contract {
  id: string;
  site_id: string;
  client_id: string;
  contract_number: string;
  start_date: string;
  end_date: string;
  value: number;
  status: string;
  monthly_value?: number;
  monthly_revenue?: number;
  auto_renewal: boolean;
  renewal_period: string;
  renewal_notice_days: number;
  termination_period: string;
  service_frequency: string;
  service_delivery_method: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  // Frontend properties
  siteName?: string;
  clientName?: string;
}

