
import { Json } from './common';

export interface ContractTerm {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  autoRenew?: boolean;
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
  contractLength?: number;
  contractLengthUnit?: string;
  noticeUnit?: string;
  notes?: string;
  type?: string;
  status?: string;
  terms?: ContractTerm[];
  renewalTerms?: string;
}

export interface Contract {
  id: string;
  siteId: string;
  clientId: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  value: number;
  status: string;
  monthlyValue?: number;
  monthlyRevenue?: number;
  autoRenewal: boolean;
  renewalPeriod: string;
  renewalNoticeDays: number;
  terminationPeriod: string;
  serviceFrequency: string;
  serviceDeliveryMethod: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  // Display properties
  siteName?: string;
  clientName?: string;
}

// Database interface for better type safety with Supabase
export interface DbContract {
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
  contract_details?: Json;
}
