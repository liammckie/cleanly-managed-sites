
import { supabase } from '@/lib/supabase';
import { UserDTO, UserRoleDTO } from '@/types/dto';
import { toast } from 'sonner';

// Fetch all users
export const getUsers = async (): Promise<UserDTO[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data as UserDTO[];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Create a new user
export const createUser = async (userData: Omit<UserDTO, 'id'>) => {
  try {
    // Add an account in Supabase Auth (if needed)
    // For now, just create a user profile
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        email: userData.email,
        full_name: userData.full_name,
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar_url: userData.avatar_url,
        title: userData.title,
        phone: userData.phone,
        custom_id: userData.custom_id,
        notes: userData.notes,
        territories: userData.territories,
        status: userData.status,
        role_id: userData.role_id,
        daily_summary: userData.daily_summary
      })
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0] as UserDTO;
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error('Failed to create user');
    throw error;
  }
};

// Update an existing user
export const updateUser = async (userId: string, userData: Partial<UserDTO>) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        email: userData.email,
        full_name: userData.full_name,
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar_url: userData.avatar_url,
        title: userData.title,
        phone: userData.phone,
        custom_id: userData.custom_id,
        notes: userData.notes,
        territories: userData.territories,
        status: userData.status,
        role_id: userData.role_id,
        daily_summary: userData.daily_summary
      })
      .eq('id', userId)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0] as UserDTO;
  } catch (error) {
    console.error('Error updating user:', error);
    toast.error('Failed to update user');
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error('Failed to delete user');
    throw error;
  }
};

// Export all functions
export const usersApi = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
