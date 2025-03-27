
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { SystemUser, UserRole } from '@/lib/types';

export type SystemUserInsert = Omit<SystemUser, 'id'> & { id?: string };

export const usersApi = {
  // Get all users
  async getUsers(): Promise<SystemUser[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');

      if (error) {
        throw error;
      }

      // Map database records to application type
      return (data || []).map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
        avatar_url: user.avatar_url,
        role_id: user.role_id,
        created_at: user.created_at,
        updated_at: user.updated_at,
        title: user.title || '',
        phone: user.phone || '',
        status: user.status as 'active' | 'pending' | 'inactive',
        last_login: user.last_login,
        custom_id: user.custom_id || '',
        note: user.notes || '',
        territories: user.territories || []
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(userId: string): Promise<SystemUser | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id,
        email: data.email,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        full_name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown',
        avatar_url: data.avatar_url,
        role_id: data.role_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        title: data.title || '',
        phone: data.phone || '',
        status: data.status as 'active' | 'pending' | 'inactive',
        last_login: data.last_login,
        custom_id: data.custom_id || '',
        note: data.notes || '',
        territories: data.territories || []
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(userId: string, userData: Partial<SystemUser>): Promise<SystemUser> {
    try {
      const updateData: any = {
        ...userData,
        updated_at: new Date().toISOString()
      };

      // Map note to notes field in the database
      if (userData.note !== undefined) {
        updateData.notes = userData.note;
        delete updateData.note;
      }

      // Remove properties that should not be sent to database
      delete updateData.role;
      delete updateData.permissions;

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        full_name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown',
        avatar_url: data.avatar_url,
        role_id: data.role_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        title: data.title || '',
        phone: data.phone || '',
        status: data.status as 'active' | 'pending' | 'inactive',
        last_login: data.last_login,
        custom_id: data.custom_id || '',
        note: data.notes || '',
        territories: data.territories || []
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Create user
  async createUser(userData: SystemUserInsert): Promise<SystemUser> {
    try {
      const userId = userData.id || uuidv4();
      
      const insertData = {
        id: userId,
        email: userData.email,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        full_name: userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Unknown',
        avatar_url: userData.avatar_url || '',
        role_id: userData.role_id,
        title: userData.title || '',
        phone: userData.phone || '',
        status: userData.status || 'active',
        custom_id: userData.custom_id || '',
        notes: userData.note || '',
        territories: userData.territories || []
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        full_name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown',
        avatar_url: data.avatar_url,
        role_id: data.role_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        title: data.title || '',
        phone: data.phone || '',
        status: data.status as 'active' | 'pending' | 'inactive',
        last_login: data.last_login,
        custom_id: data.custom_id || '',
        note: data.notes || '',
        territories: data.territories || []
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Get roles
  async getRoles(): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');

      if (error) {
        throw error;
      }

      return (data || []).map(role => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
        permissions: (typeof role.permissions === 'object' && role.permissions !== null)
          ? Object.keys(role.permissions) 
          : Array.isArray(role.permissions)
          ? role.permissions.map(p => String(p))
          : [],
        created_at: role.created_at,
        updated_at: role.updated_at
      }));
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  // Create role
  async createRole(roleData: Partial<UserRole>): Promise<UserRole> {
    try {
      if (!roleData.name) {
        throw new Error('Role name is required');
      }

      const insertData = {
        name: roleData.name,
        description: roleData.description || '',
        permissions: roleData.permissions || []
      };

      const { data, error } = await supabase
        .from('user_roles')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        permissions: (typeof data.permissions === 'object' && data.permissions !== null)
          ? Object.keys(data.permissions) 
          : Array.isArray(data.permissions)
          ? data.permissions.map(p => String(p))
          : [],
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  // Update role
  async updateRole(roleId: string, roleData: Partial<UserRole>): Promise<UserRole> {
    try {
      const updateData: Record<string, any> = {};
      
      if (roleData.name !== undefined) updateData.name = roleData.name;
      if (roleData.description !== undefined) updateData.description = roleData.description;
      if (roleData.permissions !== undefined) updateData.permissions = roleData.permissions;

      const { data, error } = await supabase
        .from('user_roles')
        .update(updateData)
        .eq('id', roleId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        permissions: (typeof data.permissions === 'object' && data.permissions !== null)
          ? Object.keys(data.permissions) 
          : Array.isArray(data.permissions)
          ? data.permissions.map(p => String(p))
          : [],
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }
};
