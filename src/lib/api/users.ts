
import { supabase } from '@/lib/supabase';
import { SystemUser, UserRole } from '@/lib/types';

// Type for user creation
export interface SystemUserInsert {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  title?: string;
  roleId?: string;
  territories?: string[];
  status?: 'active' | 'pending' | 'inactive';
  notes?: string;
}

// Define the API functions
export const usersApi = {
  /**
   * Get all users
   */
  getAllUsers: async (): Promise<SystemUser[]> => {
    try {
      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('*, role:role_id(id, name, permissions)');

      if (error) throw error;

      return users.map((user: any) => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        avatar_url: user.avatar_url,
        title: user.title,
        phone: user.phone,
        status: user.status || 'active',
        role_id: user.role_id,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
        notes: user.notes,
        territories: user.territories,
        custom_id: user.custom_id,
        daily_summary: user.daily_summary
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Get a user by ID
   */
  getUserById: async (id: string): Promise<SystemUser> => {
    try {
      const { data: user, error } = await supabase
        .from('user_profiles')
        .select('*, role:role_id(id, name, permissions)')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        avatar_url: user.avatar_url,
        title: user.title,
        phone: user.phone,
        status: user.status || 'active',
        role_id: user.role_id,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
        notes: user.notes,
        territories: user.territories,
        custom_id: user.custom_id,
        daily_summary: user.daily_summary
      };
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new user
   */
  createUser: async (userData: SystemUserInsert): Promise<SystemUser> => {
    try {
      // Prepare the user data for insertion
      const userInsert = {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        full_name: `${userData.firstName} ${userData.lastName}`.trim(),
        phone: userData.phone,
        title: userData.title,
        role_id: userData.roleId,
        territories: userData.territories || [],
        status: userData.status || 'active',
        notes: userData.notes
      };

      // Insert the user
      const { data: newUser, error } = await supabase
        .from('user_profiles')
        .insert(userInsert)
        .select('*, role:role_id(id, name, permissions)')
        .single();

      if (error) throw error;

      return {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        full_name: newUser.full_name,
        avatar_url: newUser.avatar_url,
        title: newUser.title,
        phone: newUser.phone,
        status: newUser.status,
        role_id: newUser.role_id,
        role: newUser.role,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
        notes: newUser.notes,
        territories: newUser.territories,
        custom_id: newUser.custom_id
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update an existing user
   */
  updateUser: async (id: string, userData: Partial<SystemUser>): Promise<SystemUser> => {
    try {
      // Prepare the user data for update
      const userUpdate: any = {
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        title: userData.title,
        role_id: userData.role_id,
        status: userData.status,
        territories: userData.territories,
        notes: userData.notes,
        custom_id: userData.custom_id,
        daily_summary: userData.daily_summary
      };

      // If both first_name and last_name are provided, update full_name
      if (userData.first_name && userData.last_name) {
        userUpdate.full_name = `${userData.first_name} ${userData.last_name}`.trim();
      }

      // Remove undefined values
      Object.keys(userUpdate).forEach(key => {
        if (userUpdate[key] === undefined) {
          delete userUpdate[key];
        }
      });

      // Update the user
      const { data: updatedUser, error } = await supabase
        .from('user_profiles')
        .update(userUpdate)
        .eq('id', id)
        .select('*, role:role_id(id, name, permissions)')
        .single();

      if (error) throw error;

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        full_name: updatedUser.full_name,
        avatar_url: updatedUser.avatar_url,
        title: updatedUser.title,
        phone: updatedUser.phone,
        status: updatedUser.status,
        role_id: updatedUser.role_id,
        role: updatedUser.role,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
        last_login: updatedUser.last_login,
        notes: updatedUser.notes,
        territories: updatedUser.territories,
        custom_id: updatedUser.custom_id,
        daily_summary: updatedUser.daily_summary
      };
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all user roles
   */
  getAllRoles: async (): Promise<UserRole[]> => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('*');

      if (error) throw error;

      return roles.map((role: any) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        created_at: role.created_at,
        updated_at: role.updated_at
      }));
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
  },

  /**
   * Create a new user role
   */
  createRole: async (roleData: { name: string; description?: string; permissions: string[] }): Promise<UserRole> => {
    try {
      const { data: newRole, error } = await supabase
        .from('user_roles')
        .insert({
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: newRole.id,
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        created_at: newRole.created_at,
        updated_at: newRole.updated_at
      };
    } catch (error) {
      console.error('Error creating user role:', error);
      throw error;
    }
  },

  /**
   * Update an existing user role
   */
  updateRole: async (id: string, roleData: Partial<UserRole>): Promise<UserRole> => {
    try {
      // Ensure role name is present if updating
      if (roleData.name === undefined) {
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('name')
          .eq('id', id)
          .single();
        
        if (existingRole) {
          roleData.name = existingRole.name;
        }
      }

      const { data: updatedRole, error } = await supabase
        .from('user_roles')
        .update({
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: updatedRole.id,
        name: updatedRole.name,
        description: updatedRole.description,
        permissions: updatedRole.permissions,
        created_at: updatedRole.created_at,
        updated_at: updatedRole.updated_at
      };
    } catch (error) {
      console.error(`Error updating user role ${id}:`, error);
      throw error;
    }
  }
};
