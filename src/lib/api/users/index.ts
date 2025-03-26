
import { supabase } from '@/lib/supabase';
import { SystemUser, UserRole } from '@/lib/types';

export const usersApi = {
  fetchUsers: async (): Promise<SystemUser[]> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
    
    // Transform the data to match SystemUser type
    const users: SystemUser[] = data.map(user => ({
      id: user.id,
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      full_name: user.full_name || '',
      role: user.role || 'user',
      status: (user.status as any) || 'active',
      avatar_url: user.avatar_url || '',
      role_id: user.role_id || '',
      phone: user.phone || '',
      title: user.title || '',
      notes: user.notes || '',
      custom_id: user.custom_id || '',
      last_login: user.last_login || '',
      created_at: user.created_at || '',
      updated_at: user.updated_at || '',
      territories: user.territories || []
    }));
    
    return users;
  },
  
  fetchUserById: async (userId: string): Promise<SystemUser> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
    
    // Transform the data to match SystemUser type
    const user: SystemUser = {
      id: data.id,
      email: data.email || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      full_name: data.full_name || '',
      role: data.role || 'user',
      status: (data.status as any) || 'active',
      avatar_url: data.avatar_url || '',
      role_id: data.role_id || '',
      phone: data.phone || '',
      title: data.title || '',
      notes: data.notes || '',
      custom_id: data.custom_id || '',
      last_login: data.last_login || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
      territories: data.territories || []
    };
    
    return user;
  },
  
  createUser: async (userData: Partial<SystemUser>): Promise<SystemUser> => {
    // Prepare data for insertion, making sure required fields are present
    const insertData = {
      id: userData.id,  // Will be auto-generated if not provided
      email: userData.email || '',
      full_name: userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      avatar_url: userData.avatar_url || '',
      role_id: userData.role_id || '',
      title: userData.title || '',
      phone: userData.phone || '',
      status: userData.status || 'active',
      custom_id: userData.custom_id || '',
      notes: userData.notes || '',
      territories: userData.territories || []
    };
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([insertData])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
    
    // Transform the returned data to match SystemUser type
    const newUser: SystemUser = {
      id: data.id,
      email: data.email || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      full_name: data.full_name || '',
      role: data.role || 'user',
      status: (data.status as any) || 'active',
      avatar_url: data.avatar_url || '',
      role_id: data.role_id || '',
      phone: data.phone || '',
      title: data.title || '',
      notes: data.notes || '',
      custom_id: data.custom_id || '',
      last_login: data.last_login || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
      territories: data.territories || []
    };
    
    return newUser;
  },
  
  updateUser: async (userId: string, userData: Partial<SystemUser>): Promise<SystemUser> => {
    // Prepare data for update
    const updateData = {
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
      notes: userData.notes,
      territories: userData.territories
    };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
    
    // Transform the returned data to match SystemUser type
    const updatedUser: SystemUser = {
      id: data.id,
      email: data.email || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      full_name: data.full_name || '',
      role: data.role || 'user',
      status: (data.status as any) || 'active',
      avatar_url: data.avatar_url || '',
      role_id: data.role_id || '',
      phone: data.phone || '',
      title: data.title || '',
      notes: data.notes || '',
      custom_id: data.custom_id || '',
      last_login: data.last_login || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
      territories: data.territories || []
    };
    
    return updatedUser;
  },
  
  deleteUser: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    if (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  },
  
  fetchUserRoles: async (): Promise<UserRole[]> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*');
    
    if (error) {
      throw new Error(`Error fetching user roles: ${error.message}`);
    }
    
    // Transform to match UserRole type, especially permissions
    const roles: UserRole[] = data.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: Array.isArray(role.permissions) 
        ? role.permissions 
        : typeof role.permissions === 'object'
          ? Object.keys(role.permissions).filter(key => role.permissions[key])
          : [],
      created_at: role.created_at,
      updated_at: role.updated_at
    }));
    
    return roles;
  },
  
  fetchUserRoleById: async (roleId: string): Promise<UserRole> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('id', roleId)
      .single();
    
    if (error) {
      throw new Error(`Error fetching user role: ${error.message}`);
    }
    
    // Transform to match UserRole type, especially permissions
    const role: UserRole = {
      id: data.id,
      name: data.name,
      description: data.description,
      permissions: Array.isArray(data.permissions) 
        ? data.permissions 
        : typeof data.permissions === 'object'
          ? Object.keys(data.permissions).filter(key => data.permissions[key])
          : [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return role;
  }
};
