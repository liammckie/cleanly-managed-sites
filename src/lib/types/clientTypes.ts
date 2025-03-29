
/**
 * Client related type definitions
 */

/**
 * Client record from database
 */
export interface ClientRecord {
  id: string;
  name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status: 'active' | 'pending' | 'inactive' | 'on-hold';
  notes?: string;
  custom_id?: string;
  xero_contact_id?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

/**
 * Client record with additional data
 */
export interface EnhancedClientRecord extends ClientRecord {
  total_sites?: number;
  total_revenue?: number;
  active_contacts?: number;
  site_count?: number;
}

/**
 * Client form data
 */
export interface ClientFormData {
  name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status: 'active' | 'pending' | 'inactive' | 'on-hold';
  notes?: string;
  custom_id?: string;
}
