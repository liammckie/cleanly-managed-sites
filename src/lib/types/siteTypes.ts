
/**
 * Site related type definitions
 */
import { Json, SiteStatus } from './common';
import { BillingDetails } from './billingTypes';
import { ContractDetails } from './contractTypes';

/**
 * Site record from database
 */
export interface SiteRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  status: SiteStatus;
  representative: string;
  phone?: string;
  email?: string;
  client_id: string;
  user_id: string;
  custom_id?: string;
  created_at: string;
  updated_at: string;
  contract_details?: Json;
  billing_details?: Json;
  monthly_revenue?: number;
  weekly_revenue?: number;
  annual_revenue?: number;
  monthly_cost?: number;
  subcontractors?: Json;
  replenishables?: Json;
  periodicals?: Json;
  job_specifications?: Json;
  security_details?: Json;
  has_subcontractors?: boolean;
  billing_on_hold?: boolean;
  billing_hold_start_date?: string;
  billing_hold_end_date?: string;
  // Additional fields for front-end use
  client_name?: string;
  contractor_name?: string;
  total_work_orders?: number;
  tasks_completed?: number;
  tasks_pending?: number;
  billingLines?: any[];
  additional_contracts?: any[];
}

/**
 * Enhanced site record with joined data
 */
export interface EnhancedSiteRecord extends SiteRecord {
  client_name?: string;
  contractor_name?: string;
  total_work_orders?: number;
  tasks_completed?: number;
  tasks_pending?: number;
}
