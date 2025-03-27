
import { supabase } from '@/lib/supabase';
import { UserStatus } from '@/types/common';

export interface SystemUser {
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
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  daily_summary?: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SystemUserInsert {
  email: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  phone?: string;
  title?: string;
  role_id: string;
  status: UserStatus;
  territories?: string[];
  notes?: string;
  daily_summary?: boolean;
}

export const convertDbUserToSystemUser = (dbUser: any): SystemUser => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    full_name: dbUser.full_name,
    first_name: dbUser.first_name,
    last_name: dbUser.last_name,
    avatar_url: dbUser.avatar_url,
    title: dbUser.title,
    phone: dbUser.phone,
    custom_id: dbUser.custom_id,
    notes: dbUser.notes,
    territories: dbUser.territories || [],
    status: dbUser.status as UserStatus,
    role_id: dbUser.role_id,
    role: dbUser.role ? {
      id: dbUser.role.id,
      name: dbUser.role.name,
      description: dbUser.role.description,
      permissions: Array.isArray(dbUser.role.permissions) 
        ? dbUser.role.permissions 
        : []
    } : undefined,
    created_at: dbUser.created_at,
    updated_at: dbUser.updated_at,
    last_login: dbUser.last_login,
    daily_summary: dbUser.daily_summary
  };
};

export const usersApi = {
  async getAllUsers(): Promise<SystemUser[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        role:role_id (
          id, name, description, permissions
        )
      `)
      .order('full_name');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw new Error(error.message);
    }
    
    return (data || []).map(convertDbUserToSystemUser);
  },
  
  async getUserById(id: string): Promise<SystemUser> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        role:role_id (
          id, name, description, permissions
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw new Error(error.message);
    }
    
    return convertDbUserToSystemUser(data);
  },
  
  async createUser(userData: SystemUserInsert): Promise<SystemUser> {
    // For actual implementation, you would create an auth user first
    // and then insert into user_profiles with the auth id
    
    // For now, we simulate creating a user profile
    const user = {
      id: crypto.randomUUID(), // This would normally come from auth.user.id
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      full_name: userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
      phone: userData.phone,
      title: userData.title,
      role_id: userData.role_id,
      territories: userData.territories || [],
      status: userData.status,
      notes: userData.notes || '',
      daily_summary: userData.daily_summary || false
    };
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([user])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw new Error(error.message);
    }
    
    // Now fetch the user with the role data
    return this.getUserById(data.id);
  },
  
  async updateUser(id: string, userData: Partial<SystemUser>): Promise<SystemUser> {
    if (!id) throw new Error("User ID is required");
    
    const updates = {
      ...(userData.email !== undefined && { email: userData.email }),
      ...(userData.first_name !== undefined && { first_name: userData.first_name }),
      ...(userData.last_name !== undefined && { last_name: userData.last_name }),
      ...(userData.full_name !== undefined && { full_name: userData.full_name }),
      ...(userData.phone !== undefined && { phone: userData.phone }),
      ...(userData.title !== undefined && { title: userData.title }),
      ...(userData.role_id !== undefined && { role_id: userData.role_id }),
      ...(userData.territories !== undefined && { territories: userData.territories }),
      ...(userData.status !== undefined && { status: userData.status }),
      ...(userData.notes !== undefined && { notes: userData.notes }),
      ...(userData.daily_summary !== undefined && { daily_summary: userData.daily_summary })
    };
    
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error(`Error updating user ${id}:`, error);
      throw new Error(error.message);
    }
    
    return this.getUserById(id);
  },
  
  async getAllRoles(): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching roles:', error);
      throw new Error(error.message);
    }
    
    return (data || []).map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: Array.isArray(role.permissions) ? role.permissions : [],
      created_at: role.created_at,
      updated_at: role.updated_at
    }));
  },
  
  async getRoleById(id: string): Promise<UserRole> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching role ${id}:`, error);
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      permissions: Array.isArray(data.permissions) ? data.permissions : [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
};
