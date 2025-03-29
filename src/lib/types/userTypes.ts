
/**
 * User and role related type definitions
 */
import { UserStatus } from './common';

/**
 * User role with permissions
 */
export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[] | Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
  // Frontend compatible properties
  createdAt?: string;
  updatedAt?: string;
  userCount?: number;
}

/**
 * System user profile
 */
export interface SystemUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  avatar_url?: string;
  role_id?: string;
  status: UserStatus;
  last_login?: string;
  phone?: string;
  title?: string;
  custom_id?: string;
  territories?: string[];
  notes?: string;
  created_at: string;
  updated_at?: string;
  daily_summary?: boolean;
  // Frontend fields for conversion
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatarUrl?: string;
  roleId?: string;
  customId?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  dailySummary?: boolean;
  role?: UserRole | string;
}

/**
 * User profile with full role data
 */
export interface UserProfileWithRole {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role_id?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  title?: string;
  phone?: string;
  status?: UserStatus;
  last_login?: string;
  custom_id?: string;
  notes?: string;
  territories?: string[];
}

/**
 * User profile interface (alias for SystemUser)
 */
export type UserProfile = SystemUser;

// Re-export UserStatus for convenience
export { UserStatus } from './common';
