
/**
 * User related type definitions
 */

// User status enum
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

// User role
export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
  created_at: string;
  updated_at: string;
  user_count: number;
}

// System user with profile
export interface SystemUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role_id: string;
  role?: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  last_login?: string;
  avatar_url?: string;
  phone?: string;
  custom_id?: string;
  notes?: string;
  daily_summary?: boolean;
}

// User profile with role
export interface UserProfileWithRole extends SystemUser {
  role: UserRole;
}

// User creation data
export interface UserCreationData {
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  status: UserStatus;
  password?: string;
  phone?: string;
  custom_id?: string;
  notes?: string;
  daily_summary?: boolean;
}

// User update data
export interface UserUpdateData {
  email?: string;
  first_name?: string;
  last_name?: string;
  role_id?: string;
  status?: UserStatus;
  phone?: string;
  custom_id?: string;
  notes?: string;
  daily_summary?: boolean;
  avatar_url?: string;
}
