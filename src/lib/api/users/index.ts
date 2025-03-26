
import { supabase } from '@/integrations/supabase/client';
import { SystemUser, UserRole } from '@/lib/types';

export const usersApi = {
  async getUsers(): Promise<SystemUser[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          full_name,
          avatar_url,
          role_id,
          title,
          phone,
          status,
          last_login,
          custom_id,
          note,
          territories,
          role_id (
            id,
            name,
            description,
            permissions
          )
        `);

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      // Transform the data to match SystemUser interface
      const users: SystemUser[] = data.map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        full_name: user.full_name || '',
        avatar_url: user.avatar_url,
        role_id: user.role_id?.id, // Access nested role ID
        role: user.role_id ? {
          id: user.role_id.id,
          name: user.role_id.name,
          description: user.role_id.description,
          permissions: Array.isArray(user.role_id.permissions) 
            ? user.role_id.permissions 
            : []
        } : undefined,
        created_at: user.created_at,
        updated_at: user.updated_at,
        title: user.title,
        phone: user.phone,
        status: user.status as 'active' | 'pending' | 'inactive',
        last_login: user.last_login,
        custom_id: user.custom_id,
        note: user.note,
        territories: user.territories
      }));

      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  async getUserById(userId: string): Promise<SystemUser | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          full_name,
          avatar_url,
          role_id,
          title,
          phone,
          status,
          last_login,
          custom_id,
          note,
          territories,
          role_id (
            id,
            name,
            description,
            permissions
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      const user: SystemUser = {
        id: data.id,
        email: data.email,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        full_name: data.full_name || '',
        avatar_url: data.avatar_url,
        role_id: data.role_id?.id,
        role: data.role_id ? {
          id: data.role_id.id,
          name: data.role_id.name,
          description: data.role_id.description,
          permissions: Array.isArray(data.role_id.permissions) 
            ? data.role_id.permissions 
            : []
        } : undefined,
        created_at: data.created_at,
        updated_at: data.updated_at,
        title: data.title,
        phone: data.phone,
        status: data.status as 'active' | 'pending' | 'inactive',
        last_login: data.last_login,
        custom_id: data.custom_id,
        note: data.note,
        territories: data.territories
      };

      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  },

  async createUser(userData: Partial<SystemUser>): Promise<SystemUser | null> {
    try {
      // Create the user in user_profiles table
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          full_name: userData.full_name || `${userData.first_name} ${userData.last_name}`,
          avatar_url: userData.avatar_url,
          role_id: userData.role_id,
          title: userData.title,
          phone: userData.phone,
          status: userData.status || 'active',
          custom_id: userData.custom_id,
          note: userData.note,
          territories: userData.territories
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      return this.getUserById(data.id);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<SystemUser>): Promise<SystemUser | null> {
    try {
      // Prepare update data
      const updateData: any = {};
      
      // Only include fields that are present in userData
      if (userData.email !== undefined) updateData.email = userData.email;
      if (userData.first_name !== undefined) updateData.first_name = userData.first_name;
      if (userData.last_name !== undefined) updateData.last_name = userData.last_name;
      if (userData.full_name !== undefined) updateData.full_name = userData.full_name;
      if (userData.avatar_url !== undefined) updateData.avatar_url = userData.avatar_url;
      if (userData.role_id !== undefined) updateData.role_id = userData.role_id;
      if (userData.title !== undefined) updateData.title = userData.title;
      if (userData.phone !== undefined) updateData.phone = userData.phone;
      if (userData.status !== undefined) updateData.status = userData.status;
      if (userData.custom_id !== undefined) updateData.custom_id = userData.custom_id;
      if (userData.note !== undefined) updateData.note = userData.note;
      if (userData.territories !== undefined) updateData.territories = userData.territories;
      
      // Update the user record
      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      return this.getUserById(userId);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },

  async getRoles(): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');

      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }

      return data.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
        permissions: role.permissions as string[],
        created_at: role.created_at,
        updated_at: role.updated_at
      }));
    } catch (error) {
      console.error('Error getting roles:', error);
      throw error;
    }
  },

  async createRole(roleData: Partial<UserRole>): Promise<UserRole | null> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .insert([{
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions || []
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating role:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        permissions: data.permissions as string[],
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }
};

// Helper hooks for the users API
export const useUserWithOperations = () => {
  // This is a placeholder that should be implemented in src/hooks/useUsers.ts
  return {
    user: null,
    isLoading: false,
    isError: false,
    error: null,
    updateUser: async () => {},
    deleteUser: async () => {},
    refetch: async () => {}
  };
};
