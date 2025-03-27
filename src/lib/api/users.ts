import { supabase } from '@/integrations/supabase/client';
import { SystemUser } from '@/lib/types/users';

export interface SystemUserInsert {
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string;
  role_id: string;
  title: string;
  phone: string;
  status: 'active' | 'pending' | 'inactive';
  custom_id: string;
  notes: string;
  territories: string[];
}

export async function bulkUpsertUsers(users: any[]) {
  // Make sure all users have an id
  const usersWithIds = users.map(user => {
    if (!user.id) {
      return { ...user, id: uuidv4() };
    }
    return user;
  });

  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(usersWithIds);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error during bulk user upsert:', error);
    return { success: false, error };
  }
}

export const usersApi = {
  async getUsers(): Promise<SystemUser[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return data.map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        full_name: user.full_name || '',
        role: user.role_id || '',
        status: (user.status as 'active' | 'pending' | 'inactive') || 'active',
        avatar_url: user.avatar_url || '',
        title: user.title || '',
        phone: user.phone || '',
        last_login: user.last_login || '',
        custom_id: user.custom_id || '',
        notes: user.notes || '',
        territories: user.territories || []
      }));
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
  },

  async getUserById(userId: string): Promise<SystemUser> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        full_name: data.full_name || '',
        role: data.role_id || '',
        status: (data.status as 'active' | 'pending' | 'inactive') || 'active',
        avatar_url: data.avatar_url || '',
        title: data.title || '',
        phone: data.phone || '',
        last_login: data.last_login || '',
        custom_id: data.custom_id || '',
        notes: data.notes || '',
        territories: data.territories || []
      };
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<SystemUser>): Promise<SystemUser> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          full_name: userData.full_name,
          role_id: userData.role,
          status: userData.status,
          avatar_url: userData.avatar_url,
          title: userData.title,
          phone: userData.phone,
          custom_id: userData.custom_id,
          notes: userData.notes,
          territories: userData.territories
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        full_name: data.full_name || '',
        role: data.role_id || '',
        status: (data.status as 'active' | 'pending' | 'inactive') || 'active',
        avatar_url: data.avatar_url || '',
        title: data.title || '',
        phone: data.phone || '',
        last_login: data.last_login || '',
        custom_id: data.custom_id || '',
        notes: data.notes || '',
        territories: data.territories || []
      };
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  },

  async createUser(userData: SystemUserInsert): Promise<SystemUser> {
    try {
      // First create auth user with Supabase auth
      // This would require additional setup with auth hooks and service role key
      
      // Then create user profile
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          full_name: userData.full_name,
          role_id: userData.role_id,
          status: userData.status,
          avatar_url: userData.avatar_url,
          title: userData.title,
          phone: userData.phone,
          custom_id: userData.custom_id,
          notes: userData.notes,
          territories: userData.territories
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        full_name: data.full_name || '',
        role: data.role_id || '',
        status: (data.status as 'active' | 'pending' | 'inactive') || 'active',
        avatar_url: data.avatar_url || '',
        title: data.title || '',
        phone: data.phone || '',
        last_login: data.last_login || '',
        custom_id: data.custom_id || '',
        notes: data.notes || '',
        territories: data.territories || []
      };
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }
};

export default usersApi;
