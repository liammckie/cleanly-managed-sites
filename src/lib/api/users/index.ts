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
      status: user.status,
      last_login: user.last_login,
      custom_id: user.custom_id,
      notes: user.notes,
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
      status: data.status,
      last_login: data.last_login,
      custom_id: data.custom_id,
      notes: data.notes,
      territories: data.territories,
      created_at: data.created_at,
      updated_at: data.updated_at
    } || null;
  },
  async createUser(user: Partial<SystemUser>): Promise<SystemUser> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          role_id: user.role_id,
          title: user.title,
          phone: user.phone,
          status: user.status,
          custom_id: user.custom_id,
          notes: user.notes,
          territories: user.territories,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data as SystemUser;
  },
  async updateUser(id: string, updates: Partial<SystemUser>): Promise<SystemUser> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as SystemUser;
  },
  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
