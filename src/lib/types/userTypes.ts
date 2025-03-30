
/**
 * User Types
 * Defines the data structures for user information throughout the application
 */

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions?: Record<string, boolean>;
  userCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  title?: string;
  customId?: string;
  territories?: string[];
  status?: UserStatus;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileWithRole extends UserProfile {
  role?: string;
  roleId?: string;
}

export interface SystemUser extends UserProfileWithRole {
  notes?: string;
}
