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
