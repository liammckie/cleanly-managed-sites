
import { supabase } from '@/lib/supabase';
import { SystemUser } from '@/lib/types';

// Define the users API object
export const usersApi = {
  // Get all users
  async getUsers(): Promise<SystemUser[]> {
    try {
      // Query the user_profiles table which has all the user data
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');
        
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      // Cast data to SystemUser[] and convert string status to enum
      return (data || []).map(user => ({
        ...user,
        status: (user.status as "active" | "pending" | "inactive") || "active"
      })) as SystemUser[];
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
  },
  
  // Get a single user by ID
  async getUserById(userId: string): Promise<SystemUser> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Cast to SystemUser and ensure status is valid enum
      return {
        ...data,
        status: (data.status as "active" | "pending" | "inactive") || "active"
      } as SystemUser;
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  },
  
  // Create a new user
  async createUser(userData: Partial<SystemUser>): Promise<SystemUser> {
    try {
      // Ensure required fields are present
      if (!userData.email) {
        throw new Error('Email is required to create a user');
      }
      
      // Validate status is a valid enum value
      const validStatus: ("active" | "pending" | "inactive")[] = ["active", "pending", "inactive"];
      const status = validStatus.includes(userData.status as any) 
        ? userData.status 
        : "pending";
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          ...userData,
          status
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }
      
      return data as SystemUser;
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
        console.error('Error updating user:', error);
        throw error;
      }
      
      return data as SystemUser;
    } catch (error) {
      console.error('Error in updateUser:', error);
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
        console.error('Error deleting user:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }
};

// Create a hook for user creation
export const useCreateUser = () => {
  return {
    createUser: async (userData: Partial<SystemUser>) => {
      return await usersApi.createUser(userData);
    }
  };
};

// Add this export for backward compatibility
export { usersApi };
