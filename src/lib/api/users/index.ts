
import { supabase } from '@/lib/supabase';
import { SystemUser, UserRole } from '@/lib/types';

// Define the API functions for users
export const usersApi = {
  // Fetch all users
  fetchUsers: async (): Promise<SystemUser[]> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw new Error(error.message);
    }
    
    return data.map(user => ({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role_id: user.role_id,
      created_at: user.created_at,
      updated_at: user.updated_at,
      title: user.title,
      phone: user.phone,
      status: user.status,
      last_login: user.last_login,
      custom_id: user.custom_id,
      note: user.notes,
      territories: user.territories
    }));
  },
  
  // Fetch a single user by ID
  fetchUserById: async (userId: string): Promise<SystemUser | null> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      console.error('Error fetching user:', error);
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      role_id: data.role_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      title: data.title,
      phone: data.phone,
      status: data.status,
      last_login: data.last_login,
      custom_id: data.custom_id,
      note: data.notes,
      territories: data.territories
    };
  },
  
  // Create a new user
  createUser: async (userData: Partial<SystemUser>): Promise<SystemUser> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        email: userData.email || '',
        full_name: userData.full_name || '',
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar_url: userData.avatar_url,
        role_id: userData.role_id,
        title: userData.title,
        phone: userData.phone,
        status: userData.status || 'active',
        custom_id: userData.custom_id,
        notes: userData.note,
        territories: userData.territories || []
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      role_id: data.role_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      title: data.title,
      phone: data.phone,
      status: data.status,
      last_login: data.last_login,
      custom_id: data.custom_id,
      note: data.notes,
      territories: data.territories
    };
  },
  
  // Update an existing user
  updateUser: async (userId: string, userData: Partial<SystemUser>): Promise<SystemUser> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        email: userData.email,
        full_name: userData.full_name,
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar_url: userData.avatar_url,
        role_id: userData.role_id,
        title: userData.title,
        phone: userData.phone,
        status: userData.status,
        custom_id: userData.custom_id,
        notes: userData.note,
        territories: userData.territories
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      role_id: data.role_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      title: data.title,
      phone: data.phone,
      status: data.status,
      last_login: data.last_login,
      custom_id: data.custom_id,
      note: data.notes,
      territories: data.territories
    };
  },
  
  // Delete a user
  deleteUser: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      throw new Error(error.message);
    }
  },
  
  // Get user roles
  getUserRoles: async (): Promise<UserRole[]> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*');
    
    if (error) {
      console.error('Error fetching user roles:', error);
      throw new Error(error.message);
    }
    
    return data.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      created_at: role.created_at,
      updated_at: role.updated_at
    }));
  },
  
  // Get a single role
  getUserRoleById: async (roleId: string): Promise<UserRole | null> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('id', roleId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Role not found
      }
      console.error('Error fetching user role:', error);
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
};

// Export the users API
export default usersApi;

// For backward compatibility
export const { 
  fetchUsers, 
  fetchUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  getUserRoles,
  getUserRoleById
} = usersApi;
