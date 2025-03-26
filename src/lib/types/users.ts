
export type UserStatus = 'active' | 'pending' | 'inactive';

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface SystemUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string; // Using string for better database compatibility
  role_id?: string;
  status: UserStatus;
  avatar_url?: string;
  title?: string;
  phone?: string;
  last_login?: string;
  custom_id?: string;
  notes?: string;
  territories?: string[];
  created_at?: string;
  updated_at?: string;
  permissions?: string[];
}
