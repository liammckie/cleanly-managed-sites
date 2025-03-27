import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/models';
import { SystemUser } from '@/lib/types/users';
import { adaptPermissions, adaptUserRole, permissionsToArray } from '@/utils/typeAdapters';

// User API functions
export const usersApi = {
  // Get all users
  async getUsers(): Promise<SystemUser[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('full_name');

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
  },

  // Get a user by ID
  async getUserById(userId: string): Promise<SystemUser | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error(`Error in getUserById for ID ${userId}:`, error);
      throw error;
    }
  },

  // Create a new user
  async createUser(userData: Omit<SystemUser, 'id' | 'created_at' | 'updated_at'>): Promise<SystemUser> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  },

  // Update an existing user
  async updateUser(userId: string, userData: Partial<SystemUser>): Promise<SystemUser> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(userData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error in updateUser for ID ${userId}:`, error);
      throw error;
    }
  },

  // Delete a user
  async deleteUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`Error in deleteUser for ID ${userId}:`, error);
      throw error;
    }
  },

  // Get all roles
  async getRoles(): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }

      return (data || []).map(role => adaptUserRole(role));
    } catch (error) {
      console.error('Error in getRoles:', error);
      throw error;
    }
  },

  // Get a role by ID
  async getRoleById(roleId: string): Promise<UserRole | null> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('id', roleId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        console.error(`Error fetching role with ID ${roleId}:`, error);
        throw error;
      }

      return data ? adaptUserRole(data) : null;
    } catch (error) {
      console.error(`Error in getRoleById for ID ${roleId}:`, error);
      throw error;
    }
  },

  // Create a new role
  async createRole(roleData: Omit<UserRole, 'id' | 'created_at' | 'updated_at'>): Promise<UserRole> {
    try {
      // Convert permissions to an array for the API
      const apiRoleData = {
        name: roleData.name,
        description: roleData.description || '',
        permissions: permissionsToArray(roleData.permissions || {})
      };

      const { data, error } = await supabase
        .from('user_roles')
        .insert(apiRoleData)
        .select()
        .single();

      if (error) {
        console.error('Error creating role:', error);
        throw error;
      }

      return adaptUserRole(data);
    } catch (error) {
      console.error('Error in createRole:', error);
      throw error;
    }
  },

  // Update a role
  async updateRole(roleId: string, roleData: Partial<UserRole>): Promise<UserRole> {
    try {
      // Convert permissions to an array for the API if present
      const apiRoleData: any = { ...roleData };
      
      if (roleData.permissions) {
        apiRoleData.permissions = permissionsToArray(roleData.permissions);
      }

      // Remove id, created_at, updated_at if present
      delete apiRoleData.id;
      delete apiRoleData.created_at;
      delete apiRoleData.updated_at;
      delete apiRoleData.user_count;

      const { data, error } = await supabase
        .from('user_roles')
        .update(apiRoleData)
        .eq('id', roleId)
        .select()
        .single();

      if (error) {
        console.error(`Error updating role with ID ${roleId}:`, error);
        throw error;
      }

      return adaptUserRole(data);
    } catch (error) {
      console.error(`Error in updateRole for ID ${roleId}:`, error);
      throw error;
    }
  },

  // Delete a role
  async deleteRole(roleId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) {
        console.error(`Error deleting role with ID ${roleId}:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`Error in deleteRole for ID ${roleId}:`, error);
      throw error;
    }
  }
};
