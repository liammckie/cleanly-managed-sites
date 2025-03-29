
/**
 * Contact related type definitions
 * Centralizes all contact types
 */

/**
 * Contact record interface from database
 */
export interface ContactRecord {
  id: string;
  name: string;
  entity_id: string;
  entity_type: string;
  email: string;
  phone: string;
  role: string;
  department?: string;
  is_primary: boolean;
  notes?: string;
  is_flat_rate?: boolean;
  hourly_rate?: number;
  monthly_cost?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  services?: any;
}

/**
 * Contact filters for searching/filtering contacts
 */
export interface ContactFilters {
  entity_type?: string;
  entity_id?: string;
  search?: string;
  department?: string;
  role?: string;
}

/**
 * Contact for forms
 */
export interface ContactFormData {
  id?: string;
  name: string;
  entity_id?: string;
  entity_type?: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  is_primary?: boolean;
  notes?: string;
  services?: any;
}

/**
 * Site contact (specific to sites)
 */
export interface SiteContact {
  id: string;
  site_id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  is_primary: boolean;
  notes?: string;
  department?: string;
}

/**
 * Billing contact interface
 */
export interface BillingContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  isPrimary?: boolean;
}
