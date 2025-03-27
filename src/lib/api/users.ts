
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export interface SystemUserInsert {
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role_id: string;
  status: "active" | "pending" | "inactive";
  avatar_url?: string;
  title?: string;
  phone?: string;
  custom_id?: string;
  notes?: string;
  territories?: string[];
}

// Create a usersApi object with functions to be exported
export const usersApi = {
  // Get all users
  async getUsers() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        role:user_roles(*)
      `)
      .order('created_at');

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return data || [];
  },

  // Get a specific user by ID
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        role:user_roles(*)
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }

    return data;
  },

  // Create a new user
  async createUser(userData: SystemUserInsert) {
    // Set the user's full name
    const fullName = `${userData.first_name} ${userData.last_name}`.trim();
    
    const userToCreate = {
      ...userData,
      full_name: fullName,
      id: uuidv4(),
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert([userToCreate])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data;
  },

  // Update an existing user
  async updateUser(userId: string, userData: Partial<UserRole>) {
    // If first_name or last_name are being updated, also update full_name
    let dataToUpdate = { ...userData };
    
    if (userData.first_name || userData.last_name) {
      const { data: currentUser } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();
      
      if (currentUser) {
        const firstName = userData.first_name || currentUser.first_name || '';
        const lastName = userData.last_name || currentUser.last_name || '';
        dataToUpdate.full_name = `${firstName} ${lastName}`.trim();
      }
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(dataToUpdate)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }

    return data;
  },

  // Delete an existing user
  async deleteUser(userId: string) {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }

    return true;
  },

  // Get all user roles
  async getRoles() {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*');

    if (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new user role
  async createRole(roleData: { name: string; description?: string; permissions: any }) {
    const { data, error } = await supabase
      .from('user_roles')
      .insert([roleData])
      .select()
      .single();

    if (error) {
      console.error('Error creating user role:', error);
      throw error;
    }

    return data;
  },

  // Update an existing user role
  async updateRole(roleId: string, roleData: Partial<UserRole>) {
    // Ensure name is provided for update
    if (!roleData.name && !roleData.permissions) {
      throw new Error('Name or permissions must be provided for role update');
    }

    const { data, error } = await supabase
      .from('user_roles')
      .update(roleData)
      .eq('id', roleId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating user role ${roleId}:`, error);
      throw error;
    }

    return data;
  },

  // Count users per role
  async getUserCountByRole() {
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('role_id');

    if (error) {
      console.error('Error fetching user role counts:', error);
      throw error;
    }

    const roleCounts: Record<string, number> = {};
    users?.forEach(user => {
      if (user.role_id) {
        roleCounts[user.role_id] = (roleCounts[user.role_id] || 0) + 1;
      }
    });

    return roleCounts;
  }
};
