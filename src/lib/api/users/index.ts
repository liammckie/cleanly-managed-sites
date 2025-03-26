
import { supabase } from '@/integrations/supabase/client';
import { SystemUser, UserRole } from '@/lib/types/userTypes';
import { authApi } from '@/lib/api/authApi';

// Define the user API functions
export const usersApi = {
  // Get all users
  async getUsers(): Promise<SystemUser[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    // Convert the user data to SystemUser format
    const users: SystemUser[] = data.map(user => ({
      id: user.id,
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      full_name: user.full_name || '',
      avatar_url: user.avatar_url || '',
      role: { id: user.role_id, name: '', description: '', permissions: [] }, // Role will be populated later
      status: user.status as any || 'active',
      phone: user.phone || '',
      title: user.title || '',
      last_login: user.last_login || null,
      note: user.notes || '',
      territories: user.territories || [],
      custom_id: user.custom_id || '',
    }));
    
    return users;
  },
  
  // Get a user by ID
  async getUser(userId: string): Promise<SystemUser> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
    
    // Convert the user data to SystemUser format
    const user: SystemUser = {
      id: data.id,
      email: data.email,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      full_name: data.full_name || '',
      avatar_url: data.avatar_url || '',
      role: { id: data.role_id, name: '', description: '', permissions: [] }, // Role will be populated later
      status: data.status as any || 'active',
      phone: data.phone || '',
      title: data.title || '',
      last_login: data.last_login || null,
      note: data.notes || '',
      territories: data.territories || [],
      custom_id: data.custom_id || '',
    };
    
    return user;
  },
  
  // Create a new user
  async createUser(userData: Partial<SystemUser>): Promise<SystemUser> {
    // Create user in auth system first
    const authUser = await authApi.createUser(
      userData.email || '',
      'tempPassword123', // Temporary password, should be changed by user
      userData.first_name || '',
      userData.last_name || '',
      userData.phone || '',
      userData.title || '',
      userData.role?.id || ''
    );
    
    // User should already be created in user_profiles by the auth hook,
    // but we'll update with any additional fields
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        avatar_url: userData.avatar_url,
        title: userData.title,
        phone: userData.phone,
        status: userData.status,
        custom_id: userData.custom_id,
        note: userData.note,
        territories: userData.territories,
      })
      .eq('id', authUser.id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
    
    return this.getUser(data.id);
  },
  
  // Update an existing user
  async updateUser(userId: string, userData: Partial<SystemUser>): Promise<SystemUser> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        full_name: userData.full_name || `${userData.first_name} ${userData.last_name}`,
        avatar_url: userData.avatar_url,
        role_id: userData.role?.id,
        title: userData.title,
        phone: userData.phone,
        status: userData.status,
        custom_id: userData.custom_id,
        note: userData.note,
        territories: userData.territories,
      })
      .eq('id', userId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }
    
    return this.getUser(data.id);
  },
  
  // Delete a user
  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
  
  // Get all user roles
  async getUserRoles(): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*');
    
    if (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
    
    // Convert the permissions from JSON to string[]
    const roles: UserRole[] = data.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description || '',
      permissions: Array.isArray(role.permissions) 
        ? role.permissions.map(p => String(p))
        : []
    }));
    
    return roles;
  },
  
  // Get a role by ID
  async getUserRole(roleId: string): Promise<UserRole> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('id', roleId)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      throw error;
    }
    
    const role: UserRole = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      permissions: Array.isArray(data.permissions) 
        ? data.permissions.map(p => String(p))
        : []
    };
    
    return role;
  }
};

// Add an alias for useCreateUser that uses the usersApi.createUser function
export const useCreateUser = (userData: Partial<SystemUser>) => {
  return usersApi.createUser(userData);
};

export default usersApi;
