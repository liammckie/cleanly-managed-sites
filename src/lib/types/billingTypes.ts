
/**
 * Billing related type definitions
 */
import { Json } from './common';

/**
 * Billing details structure
 */
export interface BillingDetails {
  frequency?: string;
  payment_terms?: string;
  invoicing_day?: number;
  gst_registered?: boolean;
  payment_method?: string;
  account_number?: string;
  account_name?: string;
  billing_email?: string;
  billing_address?: string;
  billing_contact?: string;
  billing_phone?: string;
  special_instructions?: string;
  purchase_order_required?: boolean;
  auto_billing?: boolean;
  billing_on_hold?: boolean;
  billing_hold_start_date?: string;
  billing_hold_end_date?: string;
  billing_notes?: string;
  xero_contact_id?: string;
  [key: string]: any; // Allow additional properties to satisfy Json compatibility
}

/**
 * Billing line item
 */
export interface BillingLineItem {
  id: string;
  site_id: string;
  description: string;
  amount: number;
  frequency?: string;
  weekly_amount?: number;
  monthly_amount?: number;
  annual_amount?: number;
  is_recurring?: boolean;
  on_hold?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Billing summary data
 */
export interface BillingSummary {
  weekly_revenue?: number;
  monthly_revenue?: number;
  annual_revenue?: number;
  monthly_cost?: number;
  profit_margin?: number;
  billing_lines?: BillingLineItem[];
}
