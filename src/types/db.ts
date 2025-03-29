// Central type registry for database-related types

// User related types
export type UserStatus = "active" | "pending" | "inactive";

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export interface UserPermission {
  id: string;
  name: string;
  description?: string;
  module: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  title?: string;
  phone?: string;
  custom_id?: string;
  notes?: string;
  territories?: string[];
  status: UserStatus;
  role_id?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  daily_summary?: boolean;
}

// Contract related types
export interface Contract {
  id: string;
  site_id: string;
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  value?: number;
  billing_cycle?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  contract_type?: string;
  auto_renewal?: boolean;
  renewal_terms?: string;
  termination_period?: string;
  // Add any other fields required
}
