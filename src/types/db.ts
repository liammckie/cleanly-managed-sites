
import { Json } from './common';

export interface Contract {
  id: string;
  site_id: string;
  client_id?: string;
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  value?: number;
  auto_renewal?: boolean;
  renewal_period?: string | number;
  renewal_notice_days?: number;
  termination_period?: string;
  billing_cycle?: string;
  contract_type?: string;
  service_frequency?: string;
  service_delivery_method?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  status?: string;
}

export interface ContractActivity {
  id: string;
  contract_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  created_by?: string;
  metadata?: Json;
}

export interface ContractDetailsForm {
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: number;
  renewalNoticeDays?: number;
  terminationPeriod?: string;
  billingCycle?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  contractType?: string;
  value?: number;
  notes?: string;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  avatar_url?: string;
  role_id?: string;
  created_at?: string;
  updated_at?: string;
  title?: string;
  phone?: string;
  status: UserStatus;
  last_login?: string;
  custom_id?: string;
  note?: string;
  territories?: string[];
  permissions?: Record<string, boolean>;
}

export type UserStatus = 'active' | 'inactive' | 'pending';
export type UserPermission = string;
