
/**
 * User Type Adapter
 * Provides consistent mapping between frontend and database user formats
 */
import { typeRegistry } from './typeRegistry';
import { SystemUser, UserRole } from '@/lib/types/userTypes';

// Define database user type to ensure proper mapping
interface DbUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  role_id?: string;
  status?: string;
  last_login?: string;
  phone?: string;
  title?: string;
  custom_id?: string;
  territories?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Define database user role type
interface DbUserRole {
  id: string;
  name: string;
  description?: string;
  permissions?: any;
  user_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Register user type mapping
typeRegistry.register<SystemUser, DbUser>({
  name: 'User',
  fields: [
    { frontend: 'id', database: 'id' },
    { frontend: 'email', database: 'email' },
    { frontend: 'firstName', database: 'first_name' },
    { frontend: 'lastName', database: 'last_name' },
    { frontend: 'fullName', database: 'full_name' },
    { frontend: 'avatarUrl', database: 'avatar_url' },
    { frontend: 'role', database: 'role' },
    { frontend: 'roleId', database: 'role_id' },
    { frontend: 'status', database: 'status' },
    { frontend: 'lastLogin', database: 'last_login' },
    { frontend: 'phone', database: 'phone' },
    { frontend: 'title', database: 'title' },
    { frontend: 'customId', database: 'custom_id' },
    { frontend: 'territories', database: 'territories' },
    { frontend: 'notes', database: 'notes' },
    { frontend: 'createdAt', database: 'created_at' },
    { frontend: 'updatedAt', database: 'updated_at' }
  ]
});

// Register user role type mapping
typeRegistry.register<UserRole, DbUserRole>({
  name: 'UserRole',
  fields: [
    { frontend: 'id', database: 'id' },
    { frontend: 'name', database: 'name' },
    { frontend: 'description', database: 'description' },
    { frontend: 'permissions', database: 'permissions' },
    { frontend: 'userCount', database: 'user_count' },
    { frontend: 'createdAt', database: 'created_at' },
    { frontend: 'updatedAt', database: 'updated_at' }
  ]
});

// Create and export user adapters
export const userAdapter = typeRegistry.createAdapter<SystemUser, DbUser>('User');
export const userRoleAdapter = typeRegistry.createAdapter<UserRole, DbUserRole>('UserRole');

// Export adapter functions directly for cleaner imports
export const adaptUserToDb = userAdapter.toDb;
export const adaptUserFromDb = userAdapter.fromDb;
export const adaptUserRoleToDb = userRoleAdapter.toDb;
export const adaptUserRoleFromDb = userRoleAdapter.fromDb;
