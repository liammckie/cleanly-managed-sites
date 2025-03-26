import { supabase } from '@/lib/supabase';
import { SystemUser, UserRole } from '@/lib/types';

export const usersApi = {
  async getUsers(): Promise<SystemUser[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*');

    if (error) throw error;

    return data.map(user => ({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role_id: user.role_id,
      title: user.title,
      phone: user.phone,
      status: user.status as "active" | "pending" | "inactive",
      last_login: user.last_login,
      custom_id: user.custom_id,
      note: user.note || '',
      territories: user.territories,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));
  },
  
  async getUserById(id: string): Promise<SystemUser | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (data) {
      return {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        role_id: data.role_id,
        title: data.title,
        phone: data.phone,
        status: data.status as "active" | "pending" | "inactive",
        last_login: data.last_login,
        custom_id: data.custom_id,
        note: data.note || '',
        territories: data.territories,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    }
    
    return null;
  },
  
  async createUser(user: Partial<SystemUser>): Promise<SystemUser> {
    // Map user object to match database column names
    const userRecord = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.full_name || `${user.first_name} ${user.last_name}`,
      role_id: user.role_id,
      status: user.status || 'active',
      avatar_url: user.avatar_url,
      title: user.title,
      phone: user.phone,
      custom_id: user.custom_id,
      note: user.note,
      territories: user.territories
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert([userRecord]);

    if (error) throw error;

    const createdUser = data?.[0];
    
    if (!createdUser) {
      throw new Error('Failed to create user');
    }

    return {
      id: createdUser.id,
      email: createdUser.email,
      first_name: createdUser.first_name,
      last_name: createdUser.last_name,
      full_name: createdUser.full_name,
      avatar_url: createdUser.avatar_url,
      role_id: createdUser.role_id,
      title: createdUser.title,
      phone: createdUser.phone,
      status: createdUser.status as "active" | "pending" | "inactive",
      last_login: createdUser.last_login,
      custom_id: createdUser.custom_id,
      note: createdUser.note,
      territories: createdUser.territories,
      created_at: createdUser.created_at,
      updated_at: createdUser.updated_at
    };
  },
  
  async updateUser(id: string, updates: Partial<SystemUser>): Promise<SystemUser> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        email: updates.email,
        first_name: updates.first_name,
        last_name: updates.last_name,
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
        role_id: updates.role_id,
        title: updates.title,
        phone: updates.phone,
        status: updates.status,
        custom_id: updates.custom_id,
        note: updates.note,
        territories: updates.territories
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      role_id: data.role_id,
      title: data.title,
      phone: data.phone,
      status: data.status as "active" | "pending" | "inactive",
      last_login: data.last_login,
      custom_id: data.custom_id,
      note: data.note,
      territories: data.territories,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },
  
  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
