
import { Json } from './common';

/**
 * Site record interface from database
 */
export interface SiteRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  client_id: string;
  client_name?: string;
  status: string;
  email: string;
  phone: string;
  representative: string;
  custom_id: string;
  contract_details?: Json;
  billing_details?: Json;
  job_specifications?: Json;
  weekly_revenue?: number;
  monthly_revenue?: number;
  annual_revenue?: number;
  monthly_cost?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

/**
 * Site contact interface
 */
export interface SiteContact {
  id: string;
  site_id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  is_primary: boolean;
  notes?: string;
  department?: string;
}

/**
 * Enhanced site record with additional properties
 */
export interface EnhancedSiteRecord extends SiteRecord {
  client_name?: string;
  contractor_name?: string;
  total_work_orders?: number;
  tasks_completed?: number;
  tasks_pending?: number;
}
