
import { UserRole as BaseUserRole } from '@/types/models';

export interface SystemUser {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  title?: string;
  phone?: string;
  custom_id?: string;
  note?: string;
  notes?: string;
  territories?: string[];
  status: "active" | "pending" | "inactive";
  role_id?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  daily_summary?: boolean;
}

export interface SystemUserInsert {
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  status: "active" | "pending" | "inactive";
  role_id?: string;
}

export type UserStatus = "active" | "pending" | "inactive";

// Use export type for re-exporting when using isolatedModules
export type UserRole = BaseUserRole;
