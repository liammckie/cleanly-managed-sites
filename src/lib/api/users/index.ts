
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { SystemUser, UserRoleWithCount } from '@/types/users';

/**
 * Fetch all user profiles
 */
export async function getAllUsers(): Promise<SystemUser[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('full_name');

    if (error) throw error;
    
    return (data || []).map(user => ({
      ...user,
      notes: user.notes || '', // Ensure notes property exists
      status: user.status as SystemUser['status'] // Cast to ensure type safety
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

/**
 * Fetch user data by ID
 */
export async function getUserById(id: string): Promise<SystemUser | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw error;
    }
    
    return {
      ...data,
      notes: data.notes || '', // Ensure notes property exists
      status: data.status as SystemUser['status'] // Cast to ensure type safety
    };
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUser(id: string, userData: Partial<SystemUser>): Promise<{success: boolean, error?: PostgrestError}> {
  try {
    // Ensure we're using the correct field name
    // No need to convert note to notes since we changed the type
    
    const { error } = await supabase
      .from('user_profiles')
      .update(userData)
      .eq('id', id);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    return { 
      success: false, 
      error: error as PostgrestError 
    };
  }
}

/**
 * Create multiple users - this function needs type safety adjustments
 */
export async function createUsers(usersData: Partial<SystemUser>[]): Promise<{success: boolean, data?: any[], error?: PostgrestError}> {
  try {
    // Ensure each user has an ID
    const preparedUsers = usersData.map(user => {
      // Add required properties for each user
      const preparedUser = {
        id: crypto.randomUUID(),
        ...user,
        notes: user.notes || '',
        full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email || ''  // Ensure email exists
      };
      return preparedUser;
    });
    
    // Insert the users one at a time to avoid type issues
    const insertPromises = preparedUsers.map(user => 
      supabase.from('user_profiles').insert(user)
    );
    
    const results = await Promise.all(insertPromises);
    const errors = results.filter(result => result.error).map(result => result.error);
    
    if (errors.length > 0) {
      throw errors[0];
    }
    
    return { 
      success: true, 
      data: preparedUsers 
    };
  } catch (error) {
    console.error('Error creating users:', error);
    return { 
      success: false, 
      error: error as PostgrestError 
    };
  }
}

/**
 * Delete a user by ID
 */
export async function deleteUser(id: string): Promise<{success: boolean, error?: PostgrestError}> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    return { 
      success: false, 
      error: error as PostgrestError 
    };
  }
}

/**
 * Get all user roles
 */
export async function getUserRoles(): Promise<UserRoleWithCount[]> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('name');

    if (error) throw error;
    
    // Get the count of users for each role
    const roleCounts: Record<string, number> = {};
    
    const { data: userProfiles, error: countError } = await supabase
      .from('user_profiles')
      .select('role_id');
      
    if (!countError && userProfiles) {
      userProfiles.forEach(profile => {
        if (profile.role_id) {
          roleCounts[profile.role_id] = (roleCounts[profile.role_id] || 0) + 1;
        }
      });
    }
    
    // Convert data to UserRoleWithCount
    return (data || []).map(role => ({
      ...role,
      user_count: roleCounts[role.id] || 0,
      permissions: typeof role.permissions === 'string' 
        ? JSON.parse(role.permissions) 
        : (Array.isArray(role.permissions) ? role.permissions : [])
    }));
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
}
