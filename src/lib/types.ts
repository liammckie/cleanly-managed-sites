
// Types for database records
export interface SiteRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  status: 'active' | 'inactive' | 'pending';
  representative: string;
  phone?: string;
  email?: string;
  created_at?: string;
  user_id?: string;
  client_id: string;
  monthly_cost?: number;
  monthly_revenue?: number;
  custom_id?: string; // Add custom ID field
  // Client data that may be joined from the query
  client_name?: string;
  // JSON fields
  security_details?: any;
  job_specifications?: any;
  periodicals?: any;
  replenishables?: any;
  contract_details?: any;
  billing_details?: any;
  subcontractors?: any;
  // Contacts
  contacts?: ContactRecord[];
}

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
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  custom_id?: string; // Add custom ID field
  // Contacts
  contacts?: ContactRecord[];
}

export interface ContactRecord {
  id?: string;
  name: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
  notes?: string;
  entity_id: string; // Either client_id or site_id
  entity_type: 'client' | 'site';
  created_at?: string;
  updated_at?: string;
}

export interface ContractorRecord {
  id: string;
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status: 'active' | 'inactive' | 'pending';
  contractor_type: string;
  hourly_rate?: number;
  day_rate?: number;
  abn?: string;
  tax_id?: string;
  notes?: string;
  specialty?: string[];
  rating?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContractorVersionHistoryEntry {
  id: string;
  contractor_id: string;
  contractor_data: ContractorRecord;
  version_number: number;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
}

// Import the PermissionsMap type from the permissions file
import { PermissionsMap } from '@/types/permissions';

export interface SystemUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending';
  last_login?: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  phone?: string;
  custom_id?: string;
  note?: string;
  territories?: string[];
  permissions?: PermissionsMap;
}
