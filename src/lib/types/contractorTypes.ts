
/**
 * Contractor related type definitions
 * Centralizes all contractor types
 */

/**
 * Contractor record interface from database
 */
export interface ContractorRecord {
  id: string;
  business_name: string;
  name?: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status: 'active' | 'inactive' | 'pending';
  tax_id?: string;
  user_id: string;
  hourly_rate?: number;
  day_rate?: number;
  rating?: number;
  created_at?: string;
  updated_at?: string;
  abn?: string;
  contractor_type: string;
  specialty?: string[];
  notes?: string;
  custom_id?: string;
  services?: string[];
}

/**
 * Contractor history entry
 */
export interface ContractorHistoryEntry {
  id: string;
  contractor_id: string;
  contractor_data: any;
  notes?: string;
  version_number: number;
  created_at: string;
  created_by?: string;
}

/**
 * Subcontractor interface (specific to sites)
 */
export interface Subcontractor {
  id: string;
  site_id: string;
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  is_flat_rate?: boolean;
  monthly_cost?: number;
  services?: string[] | any;
  custom_services?: string;
  contractor_id?: string;
}

/**
 * Quote subcontractor (specific to quotes)
 */
export interface QuoteSubcontractor {
  id: string;
  quote_id: string;
  name: string;
  description?: string;
  cost: number;
  frequency: string;
  email?: string;
  phone?: string;
  notes?: string;
  service?: string;
  services?: string[];
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
}
