
import { supabase } from '@/lib/supabase';
import { SystemUser, UserRole } from '@/lib/types/users';
import { Json } from '@/types/common';
import { v4 as uuidv4 } from 'uuid';

// Type definition for user insert
export interface SystemUserInsert {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  title?: string;
  role_id: string;
  status?: string;
  full_name?: string;
  password?: string;
}

// API methods for users
export const usersApi = {
  // Get all users
  async getAllUsers(): Promise<SystemUser[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('full_name');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    return data as SystemUser[];
  },
  
  // Get a single user by ID
  async getUserById(id: string): Promise<SystemUser> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
    
    return data as SystemUser;
  },
  
  // Create a new user
  async createUser(userData: SystemUserInsert): Promise<SystemUser> {
    // Generate a UUID for the new user
    const userId = uuidv4();
    
    // Map the input data to match the required database fields
    const dbUserData = {
      id: userId,
      email: userData.email,
      full_name: userData.full_name || `${userData.firstName} ${userData.lastName}`,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone,
      title: userData.title,
      role_id: userData.role_id,
      status: userData.status || 'active',
    };
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(dbUserData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }
    
    return data as SystemUser;
  },
  
  // Update a user
  async updateUser(id: string, userData: Partial<SystemUser>): Promise<SystemUser> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
    
    return data as SystemUser;
  },
  
  // Delete a user
  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Change a user's status
  async changeUserStatus(id: string, status: string): Promise<SystemUser> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error changing status for user with ID ${id}:`, error);
      throw error;
    }
    
    return data as SystemUser;
  },
  
  // Get all user roles
  async getAllRoles(): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
    
    // Transform the permissions from Json to string[]
    return data.map(role => ({
      ...role,
      permissions: this.convertPermissionsToArray(role.permissions)
    })) as UserRole[];
  },
  
  // Get a single role by ID
  async getRoleById(id: string): Promise<UserRole> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching role with ID ${id}:`, error);
      throw error;
    }
    
    // Transform the permissions from Json to string[]
    return {
      ...data,
      permissions: this.convertPermissionsToArray(data.permissions)
    } as UserRole;
  },
  
  // Helper method to convert permissions from Json to string[]
  convertPermissionsToArray(permissions: any): string[] {
    if (typeof permissions === 'object' && permissions !== null) {
      return Object.keys(permissions).filter(key => permissions[key] === true);
    } else if (Array.isArray(permissions)) {
      return permissions.map(p => String(p));
    }
    return [];
  },
  
  // Create a new role
  async createRole(roleData: Partial<UserRole>): Promise<UserRole> {
    // Convert string[] permissions to JSON object
    const permissionsObj: { [key: string]: boolean } = {};
    (roleData.permissions || []).forEach(perm => {
      permissionsObj[perm] = true;
    });
    
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        name: roleData.name,
        description: roleData.description,
        permissions: permissionsObj
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating role:', error);
      throw error;
    }
    
    // Transform the permissions from Json to string[]
    return {
      ...data,
      permissions: this.convertPermissionsToArray(data.permissions)
    } as UserRole;
  },
  
  // Update a role
  async updateRole(id: string, roleData: Partial<UserRole>): Promise<UserRole> {
    // Prepare update data
    const updateData: any = {};
    
    if (roleData.name !== undefined) {
      updateData.name = roleData.name;
    }
    
    if (roleData.description !== undefined) {
      updateData.description = roleData.description;
    }
    
    if (roleData.permissions !== undefined) {
      // Convert string[] permissions to JSON object
      const permissionsObj: { [key: string]: boolean } = {};
      roleData.permissions.forEach(perm => {
        permissionsObj[perm] = true;
      });
      updateData.permissions = permissionsObj;
    }
    
    const { data, error } = await supabase
      .from('user_roles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating role with ID ${id}:`, error);
      throw error;
    }
    
    // Transform the permissions from Json to string[]
    return {
      ...data,
      permissions: this.convertPermissionsToArray(data.permissions)
    } as UserRole;
  },
  
  // Delete a role
  async deleteRole(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting role with ID ${id}:`, error);
      throw error;
    }
  }
};
