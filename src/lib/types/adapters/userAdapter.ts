
/**
 * User Type Adapter
 * Provides consistent mapping between frontend and database user formats
 */
import { typeRegistry } from './typeRegistry';
import { UserRole, UserProfile, SystemUser } from '@/lib/types/userTypes';
import { Json } from '@/lib/types/common';

// Define database user types
export interface DbUserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Json;
  user_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DbUserProfile {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  phone?: string;
  avatar_url?: string;
  role_id?: string;
  status: string;
  territories?: string[];
  notes?: string;
  custom_id?: string;
  daily_summary?: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

// Register user role type mapping
typeRegistry.register<UserRole, DbUserRole>({
  name: 'UserRole',
  fields: [
    { frontend: 'id', database: 'id' },
    { frontend: 'name', database: 'name' },
    { frontend: 'description', database: 'description' },
    { 
      frontend: 'permissions', 
      database: 'permissions',
      transform: (value, direction) => {
        // Handle permissions format conversion
        if (direction === 'toDb') {
          // Convert permissions to the expected database format
          if (Array.isArray(value)) {
            // If permissions is an array of strings, convert to object
            const permObject: Record<string, boolean> = {};
            value.forEach(perm => { permObject[perm] = true; });
            return permObject as Json;
          }
          // If already an object, just pass through
          return value as Json;
        } else {
          // Convert from DB format to frontend format
          if (typeof value === 'object' && value !== null) {
            return value;
          }
          return {};
        }
      }
    },
    { frontend: 'userCount', database: 'user_count' },
    { frontend: 'createdAt', database: 'created_at' },
    { frontend: 'updatedAt', database: 'updated_at' }
  ]
});

// Register user profile type mapping
typeRegistry.register<UserProfile, DbUserProfile>({
  name: 'UserProfile',
  fields: [
    { frontend: 'id', database: 'id' },
    { frontend: 'email', database: 'email' },
    { frontend: 'fullName', database: 'full_name' },
    { frontend: 'firstName', database: 'first_name' },
    { frontend: 'lastName', database: 'last_name' },
    { frontend: 'title', database: 'title' },
    { frontend: 'phone', database: 'phone' },
    { frontend: 'avatarUrl', database: 'avatar_url' },
    { frontend: 'roleId', database: 'role_id' },
    { frontend: 'status', database: 'status' },
    { frontend: 'territories', database: 'territories' },
    { frontend: 'notes', database: 'notes' },
    { frontend: 'customId', database: 'custom_id' },
    { frontend: 'dailySummary', database: 'daily_summary' },
    { frontend: 'createdAt', database: 'created_at' },
    { frontend: 'updatedAt', database: 'updated_at' },
    { frontend: 'lastLogin', database: 'last_login' }
  ]
});

// Register system user type mapping (extends user profile with role data)
typeRegistry.register<SystemUser, DbUserProfile>({
  name: 'SystemUser',
  fields: [
    { frontend: 'id', database: 'id' },
    { frontend: 'email', database: 'email' },
    { frontend: 'fullName', database: 'full_name' },
    { frontend: 'firstName', database: 'first_name' },
    { frontend: 'lastName', database: 'last_name' },
    { frontend: 'title', database: 'title' },
    { frontend: 'phone', database: 'phone' },
    { frontend: 'avatarUrl', database: 'avatar_url' },
    { frontend: 'roleId', database: 'role_id' },
    { frontend: 'status', database: 'status' },
    { frontend: 'territories', database: 'territories' },
    { frontend: 'notes', database: 'notes' },
    { frontend: 'customId', database: 'custom_id' },
    { frontend: 'dailySummary', database: 'daily_summary' },
    { frontend: 'createdAt', database: 'created_at' },
    { frontend: 'updatedAt', database: 'updated_at' },
    { frontend: 'lastLogin', database: 'last_login' }
  ]
});

// Create and export user adapters
export const userRoleAdapter = typeRegistry.createAdapter<UserRole, DbUserRole>('UserRole');
export const userProfileAdapter = typeRegistry.createAdapter<UserProfile, DbUserProfile>('UserProfile');
export const systemUserAdapter = typeRegistry.createAdapter<SystemUser, DbUserProfile>('SystemUser');

// Export adapter functions directly for cleaner imports
export const adaptUserRoleFromDb = userRoleAdapter.fromDb;
export const adaptUserRoleToDb = userRoleAdapter.toDb;
export const adaptUserFromDb = userProfileAdapter.fromDb;
export const adaptUserToDb = userProfileAdapter.toDb;
export const adaptSystemUserFromDb = systemUserAdapter.fromDb;
export const adaptSystemUserToDb = systemUserAdapter.toDb;
