
import { supabase } from '@/lib/supabase';
import { SystemUser, UserRole } from '@/lib/types';

// Create a users API module
export const usersApi = {
  getUsers: async (): Promise<SystemUser[]> => {
    try {
      // Instead of directly querying the auth.users table (which isn't allowed),
      // we need to query the user_profiles table instead
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      // Map from database format to SystemUser format
      return (data || []).map((profile) => ({
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role_id: profile.role_id,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        title: profile.title,
        phone: profile.phone,
        status: profile.status || 'active',
        last_login: profile.last_login,
        custom_id: profile.custom_id,
        note: profile.notes,
        territories: profile.territories,
      }));
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
  },
  
  getUserById: async (userId: string): Promise<SystemUser | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }
      
      if (!data) return null;
      
      // Map from database format to SystemUser format
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
        status: data.status || 'active',
        last_login: data.last_login,
        custom_id: data.custom_id,
        note: data.notes,
        territories: data.territories,
      };
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  },
  
  // More user-related functions can be added here
};
