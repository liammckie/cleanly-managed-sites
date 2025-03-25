
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Define SystemUser type
export interface SystemUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
  phone?: string;
  is_active?: boolean;
}

// Get all users
export const getUsers = async (): Promise<SystemUser[]> => {
  try {
    // Use auth.users table for system users
    const { data, error } = await supabase
      .from('users') // Use the proper table name
      .select('*');

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return data as SystemUser[];
  } catch (error) {
    console.error('Error in getUsers:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id: string): Promise<SystemUser> => {
  try {
    const { data, error } = await supabase
      .from('users') // Use the proper table name
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return data as SystemUser;
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  }
};

// Create user
export const createUser = async (userData: Partial<SystemUser>): Promise<SystemUser> => {
  try {
    const { data, error } = await supabase
      .from('users') // Use the proper table name
      .insert([userData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }
    
    toast.success('User created successfully');
    
    return data as SystemUser;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (id: string, userData: Partial<SystemUser>): Promise<SystemUser> => {
  try {
    const { data, error } = await supabase
      .from('users') // Use the proper table name
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
    
    toast.success('User updated successfully');
    
    return data as SystemUser;
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users') // Use the proper table name
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
    
    toast.success('User deleted successfully');
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw error;
  }
};
