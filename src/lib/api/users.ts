
import { SystemUser } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export const usersApi = {
  async getUserById(userId: string): Promise<SystemUser> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return data as SystemUser;
  },
  
  async updateUser(userId: string, userData: Partial<SystemUser>): Promise<SystemUser> {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as SystemUser;
  },
  
  async createUser(userData: Partial<SystemUser>): Promise<SystemUser> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as SystemUser;
  },
  
  async getAllUsers(): Promise<SystemUser[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data as SystemUser[];
  }
};
