
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface SystemUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  avatar_url?: string;
  phone?: string;
}

export const usersApi = {
  async getUsers(): Promise<SystemUser[]> {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .select('*');

      if (error) throw error;
      return data as SystemUser[];
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      return [];
    }
  },

  async getUser(id: string): Promise<SystemUser | null> {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as SystemUser;
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to fetch user details');
      return null;
    }
  },

  async createUser(userData: Partial<SystemUser>): Promise<SystemUser> {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .insert([userData])
        .select('*')
        .single();

      if (error) throw error;
      toast.success('User created successfully');
      return data as SystemUser;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
      throw error;
    }
  },

  async updateUser(id: string, userData: Partial<SystemUser>): Promise<SystemUser> {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .update(userData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      toast.success('User updated successfully');
      return data as SystemUser;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      throw error;
    }
  }
};
