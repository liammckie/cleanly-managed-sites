
import { supabase } from '@/lib/supabase';
import { UserRole, UserRoleWithCount } from '@/lib/types/users';
import { UserDTO } from '@/types/dto';

// Get all users
export const getUsers = async (): Promise<UserDTO[]> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*');

  if (error) throw error;
  return data as UserDTO[];
};

// Get a single user by ID
export const getUserById = async (id: string): Promise<UserDTO> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as UserDTO;
};

// Create a new user
export const createUser = async (user: Partial<UserDTO>): Promise<UserDTO> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      email: user.email,
      full_name: user.full_name,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar_url: user.avatar_url,
      title: user.title,
      phone: user.phone,
      custom_id: user.custom_id,
      notes: user.notes,
      territories: user.territories,
      status: user.status || 'active',
      role_id: user.role_id,
      daily_summary: user.daily_summary,
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserDTO;
};

// Update an existing user
export const updateUser = async (id: string, user: Partial<UserDTO>): Promise<UserDTO> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      email: user.email,
      full_name: user.full_name,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar_url: user.avatar_url,
      title: user.title,
      phone: user.phone,
      custom_id: user.custom_id,
      notes: user.notes,
      territories: user.territories,
      status: user.status,
      role_id: user.role_id,
      daily_summary: user.daily_summary,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as UserDTO;
};

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

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
