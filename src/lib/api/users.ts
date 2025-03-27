
import { supabase } from '@/integrations/supabase/client';
import { UserStatus } from '@/types/common';

// Types
export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  user_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
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
  daily_summary?: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

// Create a new user
export async function createUser(userData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) {
  // Generate a UUID for the user ID
  const id = crypto.randomUUID();
  
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id,
      ...userData
    });

  if (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }

  return data;
}

// Get all users
export async function getUsers() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*');

  if (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }

  return data;
}

// Get a user by ID
export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }

  return data;
}

// Update a user
export async function updateUser(id: string, userData: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(userData)
    .eq('id', id);

  if (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }

  return data;
}

// Delete a user
export async function deleteUser(id: string) {
  const { error } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }

  return true;
}

// Get all roles
export async function getRoles() {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*');

  if (error) {
    throw new Error(`Error fetching roles: ${error.message}`);
  }

  return data;
}

// Get a role by ID
export async function getRole(id: string) {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching role: ${error.message}`);
  }

  return data;
}

// Create a new role
export async function createRole(roleData: Partial<UserRole>) {
  const { data, error } = await supabase
    .from('user_roles')
    .insert(roleData);

  if (error) {
    throw new Error(`Error creating role: ${error.message}`);
  }

  return data;
}

// Update a role
export async function updateRole(id: string, roleData: Partial<UserRole>) {
  const { data, error } = await supabase
    .from('user_roles')
    .update(roleData)
    .eq('id', id);

  if (error) {
    throw new Error(`Error updating role: ${error.message}`);
  }

  return data;
}

// Delete a role
export async function deleteRole(id: string) {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting role: ${error.message}`);
  }

  return true;
}

// Count users with a specific role
export async function countUsersWithRole(roleId: string) {
  const { count, error } = await supabase
    .from('user_profiles')
    .select('id', { count: 'exact' })
    .eq('role_id', roleId);

  if (error) {
    throw new Error(`Error counting users with role: ${error.message}`);
  }

  return count || 0;
}
