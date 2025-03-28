
import { UserStatus } from '@/types/common';

export { UserStatus } from '@/types/common';

export interface SystemUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  avatar_url?: string;
  role_id?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  title?: string;
  phone?: string;
  status: UserStatus;
  last_login?: string;
  custom_id?: string;
  note?: string;
  territories?: string[];
  permissions?: Record<string, boolean>;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  avatar_url?: string;
  title?: string;
  phone?: string;
  status: UserStatus;
  role_id?: string;
  custom_id?: string;
  notes?: string;
  territories?: string[];
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  daily_summary?: boolean;
}
