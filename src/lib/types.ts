
// Define general types for the application

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

// User related types
export interface SystemUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  role_id?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  title?: string;
  phone?: string;
  status?: 'active' | 'pending' | 'inactive';
  last_login?: string;
  custom_id?: string;
  note?: string;
  territories?: string[];
  permissions?: string[]; // Add permissions property
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}

export interface UserRoleWithCount extends UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  user_count?: number;
}

// Client related types
export interface ClientRecord {
  id: string;
  name: string;
  contact_name: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  postcode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  notes?: string;
  logo_url?: string;
  industry?: string;
  status?: 'active' | 'inactive' | 'prospect' | 'pending';
  client_since?: string;
  created_at?: string;
  updated_at?: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
  billing_contact_name?: string;
  billing_email?: string;
  billing_phone?: string;
  account_manager_id?: string;
  account_manager_name?: string;
  primary_contact_id?: string;
  primary_contact_name?: string;
  annual_revenue?: number;
  monthly_revenue?: number;
  total_sites?: number;
  custom_id?: string;
  contacts?: ContactRecord[];
}

// Contact related types
export interface ContactRecord {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  notes?: string;
  entity_id: string;
  entity_type: string;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
  monthly_cost?: number;
  is_flat_rate?: boolean;
  services?: string[];
  user_id?: string;
}

// Site related types
export interface SiteRecord {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  postcode?: string;
  country?: string;
  client_id?: string;
  client_name?: string;
  site_manager_id?: string;
  site_manager_name?: string;
  location_details?: Json;
  monthly_revenue?: number;
  monthly_cost?: number;
  annual_revenue?: number;
  weekly_revenue?: number;
  contract_details?: Json;
  job_specifications?: Json;
  security_details?: Json;
  billing_details?: Json;
  status?: 'active' | 'inactive' | 'pending' | 'on-hold';
  created_at?: string;
  updated_at?: string;
  replenishables?: Json;
  periodicals?: Json;
  [key: string]: any;
}

// Contractor related types
export interface ContractorRecord {
  id: string;
  name?: string;
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  postcode?: string;
  abn?: string;
  tax_id?: string;
  insurance_details?: Json;
  payment_details?: Json;
  services?: string[];
  notes?: string;
  status?: 'active' | 'inactive' | 'pending';
  created_at?: string;
  updated_at?: string;
  document_ids?: string[];
  contractor_type?: string;
  hourly_rate?: number;
  day_rate?: number;
  specialty?: string[];
  rating?: number;
}

export interface ContractorVersionHistoryEntry {
  id: string;
  contractor_id: string;
  contractor_data: Json;
  created_at: string;
  created_by?: string;
  notes?: string;
  version_number: number;
}

// Site Contact type used in forms
export interface SiteContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  notes?: string;
  entity_id?: string;
  entity_type?: string;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Site Status enum
export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold';
