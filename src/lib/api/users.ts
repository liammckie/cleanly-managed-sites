
import { supabase } from '@/lib/supabase';
import { UserRole, UserRoleWithCount } from '@/lib/types/users';

// Get all roles
export const getRoles = async (): Promise<UserRoleWithCount[]> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*');

  if (error) throw error;
  return data as UserRoleWithCount[];
};

// Get a single role by ID
export const getRole = async (id: string): Promise<UserRole> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as UserRole;
};

// Create a new role
export const createRole = async (role: Partial<UserRole>): Promise<UserRole> => {
  const { data, error } = await supabase
    .from('user_roles')
    .insert({
      name: role.name,
      description: role.description,
      permissions: role.permissions || {},
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserRole;
};

// Update an existing role
export const updateRole = async (id: string, data: Partial<UserRole>): Promise<UserRole> => {
  const { data: updatedRole, error } = await supabase
    .from('user_roles')
    .update({
      name: data.name,
      description: data.description,
      permissions: data.permissions,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return updatedRole as UserRole;
};

// Delete a role
export const deleteRole = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
