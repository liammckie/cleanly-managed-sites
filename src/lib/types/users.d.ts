
import { Json } from '@/types/common';

export interface SystemUser {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  title?: string;
  status: string;
  role_id?: string;
  avatarUrl?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  custom_id?: string;
  notes?: string;
  territories?: string[];
  daily_summary?: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

// Alias UserRole as SystemUserRole for backward compatibility
export type SystemUserRole = UserRole;

export interface SystemUserInsert {
  email: string;
  firstName: string;
  lastName: string;
  full_name: string;
  phone?: string;
  title?: string;
  role_id: string;
  status?: string;
  password?: string;
}
