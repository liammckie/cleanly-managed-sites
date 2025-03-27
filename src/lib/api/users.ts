
import { supabase } from '@/integrations/supabase/client';
import { SystemUser, UserRole, UserStatus } from '@/lib/types/users';
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export interface SystemUserInsert {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  title?: string;
  roleId?: string;
  status?: UserStatus;
  avatar_url?: string;
  notes?: string;
  custom_id?: string;
  territories?: string[];
}

// Users API
export const usersApi = {
  async getAllUsers(): Promise<SystemUser[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        role:role_id (
          id,
          name,
          description,
          permissions
        )
      `)
      .order('full_name');

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return data as SystemUser[];
  },

  async getUserById(id: string): Promise<SystemUser | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        role:role_id (
          id,
          name,
          description,
          permissions
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching user:', error);
      throw error;
    }

    return data as SystemUser;
  },

  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    title: string;
    roleId: string;
    password: string;
  }): Promise<SystemUser> {
    try {
      // Create auth user
      const fullName = `${userData.firstName} ${userData.lastName}`;
      
      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          full_name: fullName,
          phone: userData.phone,
          title: userData.title,
          role_id: userData.roleId,
          status: 'pending'
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        throw profileError;
      }

      return profileData as SystemUser;
    } catch (error) {
      console.error('Error in user creation flow:', error);
      throw error;
    }
  },

  async updateUser(id: string, userData: Partial<SystemUser>): Promise<SystemUser> {
    // Prepare data for update
    const updateData: any = {
      ...(userData.email && { email: userData.email }),
      ...(userData.first_name && { first_name: userData.first_name }),
      ...(userData.last_name && { last_name: userData.last_name }),
      ...(userData.phone && { phone: userData.phone }),
      ...(userData.title && { title: userData.title }),
      ...(userData.status && { status: userData.status }),
      ...(userData.role_id && { role_id: userData.role_id }),
      ...(userData.avatar_url && { avatar_url: userData.avatar_url }),
      ...(userData.notes && { notes: userData.notes }),
      ...(userData.custom_id && { custom_id: userData.custom_id }),
      ...(userData.territories && { territories: userData.territories })
    };

    // Only update full_name if first_name or last_name is provided
    if (userData.first_name || userData.last_name) {
      const currentUser = await this.getUserById(id);
      const newFirstName = userData.first_name || currentUser?.first_name || '';
      const newLastName = userData.last_name || currentUser?.last_name || '';
      updateData.full_name = `${newFirstName} ${newLastName}`.trim();
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return data as SystemUser;
  },

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Role management
  async getAllRoles(): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }

    return data as UserRole[];
  },

  async createRole(roleData: Partial<UserRole>): Promise<UserRole> {
    if (!roleData.name) {
      throw new Error('Role name is required');
    }

    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating role:', error);
      throw error;
    }

    return data as UserRole;
  },

  async updateRole(id: string, roleData: Partial<UserRole>): Promise<UserRole> {
    const updateData: any = {
      ...(roleData.name && { name: roleData.name }),
      ...(roleData.description !== undefined && { description: roleData.description }),
      ...(roleData.permissions && { permissions: roleData.permissions })
    };

    const { data, error } = await supabase
      .from('user_roles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating role:', error);
      throw error;
    }

    return data as UserRole;
  },

  async deleteRole(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }
};
