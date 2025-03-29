
import { Json, UserStatus } from '@/types/common';

// User role definition
export type UserRoleString = 'admin' | 'manager' | 'staff' | 'client' | 'contractor';

export interface UserRoleObject {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

export type UserRole = UserRoleString | UserRoleObject;

// System user interface
export interface SystemUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  title?: string;
  customId?: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  lastLogin?: string;
  territories?: string[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// DB/API style user profile - with snake_case
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
  title?: string;
  custom_id?: string;
  role: UserRole;
  status: string;
  avatar_url?: string;
  last_login?: string;
  territories?: string[];
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserProfileWithRole extends UserProfile {
  role_details?: UserRoleObject;
}

// Function to convert between user formats
export function dbUserToSystemUser(user: UserProfile): SystemUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    fullName: user.full_name,
    phone: user.phone,
    title: user.title,
    customId: user.custom_id,
    role: user.role,
    status: user.status as UserStatus,
    avatarUrl: user.avatar_url,
    lastLogin: user.last_login,
    territories: user.territories,
    notes: user.notes,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
}

export function systemUserToDbUser(user: SystemUser): UserProfile {
  return {
    id: user.id,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    full_name: user.fullName,
    phone: user.phone,
    title: user.title,
    custom_id: user.customId,
    role: user.role,
    status: user.status,
    avatar_url: user.avatarUrl,
    last_login: user.lastLogin,
    territories: user.territories,
    notes: user.notes,
    created_at: user.createdAt,
    updated_at: user.updatedAt
  };
}
