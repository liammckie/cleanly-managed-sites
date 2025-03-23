
import { PermissionsMap } from '@/types/permissions';

// User and Auth related types
export type UserRole = {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
};

export type SystemUser = {
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
};

// Client related types
export type ClientRecord = {
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
  created_at: string;
  updated_at: string;
  xero_contact_id?: string;
  custom_id?: string;
  user_id: string;
  contacts?: ContactRecord[];
};

// Contact related types
export type ContactRecord = {
  id: string;
  name: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
  notes?: string;
  entity_id: string;
  entity_type: 'site' | 'client';
  user_id?: string;
  created_at: string;
  updated_at: string;
};

// Site related types
export type SiteRecord = {
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
  client_id: string;
  client_name?: string; // Add client_name property for join results
  custom_id?: string;
  monthly_cost?: number;
  monthly_revenue?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  has_subcontractors?: boolean;
  security_details?: any;
  job_specifications?: any;
  periodicals?: any;
  replenishables?: any;
  contract_details?: any;
  billing_details?: any;
  subcontractors?: any[];
  contacts?: ContactRecord[];
};

// Contractor related types
export type ContractorRecord = {
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
  rating?: number;
  tax_id?: string;
  abn?: string;
  specialty?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  custom_id?: string;
};

export type ContractorVersionHistoryEntry = {
  id: string;
  contractor_id: string;
  contractor_data: ContractorRecord;
  version_number: number;
  notes?: string;
  created_at: string;
  created_by?: string;
};

// Work order related types
export type WorkOrderRecord = {
  id: string;
  title: string;
  description: string;
  site_id: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to?: string;
  estimated_cost?: number;
  actual_cost?: number;
  billing_amount?: number;
  due_date?: string;
  completion_date?: string;
  purchase_order_number?: string;
  xero_purchase_order_id?: string;
  requires_purchase_order?: boolean;
  xero_invoice_id?: string;
  xero_synced_at?: string;
  sync_status?: string;
  attachments?: any;
};

// Export types from api/index to maintain compatibility
export * from './api/types';
