
/**
 * User related type definitions
 * Centralizes all user types
 */
import { UserStatus } from './common';

/**
 * User role interface with permissions as Record
 */
export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
  
  // Camel case aliases for frontend use
  createdAt?: string;
  updatedAt?: string;
  userCount?: number;
}

/**
 * System user interface 
 */
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
  notes?: string;
  territories?: string[];
  status: UserStatus;
  role_id?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  daily_summary?: boolean;
  
  // Camel case aliases for frontend use
  fullName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  customId?: string;
  roleId?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  dailySummary?: boolean;
}

/**
 * Database user role with permissions array (from database)
 */
export interface DbUserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[] | Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
}

/**
 * User profile with role (for UI displays)
 */
export interface UserProfileWithRole extends SystemUser {
  role: UserRole;
}

/**
 * User profile (simplified user information)
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  status: UserStatus;
}

/**
 * For creating a new user
 */
export interface SystemUserInsert extends Omit<SystemUser, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
}
