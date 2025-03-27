
import { supabase } from '@/integrations/supabase/client';
import { SystemUser, UserRole } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Get all users
export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

// Get a user by ID
export async function getUserById(id: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

// Update a user
export async function updateUser(id: string, userData: Partial<SystemUser>) {
  try {
    // Fix: Remove notes from userData if it exists, and use note instead
    const { notes, ...restUserData } = userData as any;
    
    const updateData = {
      ...restUserData,
      // If notes was provided, use it for the note field
      ...(notes && { note: notes })
    };
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

// Create multiple users
export async function createUsers(users: SystemUser[]) {
  try {
    // Fix: Each user in the array needs an ID, add it if missing
    const usersWithIds = users.map(user => ({
      ...user,
      id: user.id || uuidv4()
    }));
    
    // Insert users one by one rather than as an array to handle the validation
    const results = [];
    for (const user of usersWithIds) {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(user)
        .select();
      
      if (error) {
        console.error('Error creating user:', error);
      } else {
        results.push(data);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error creating users:', error);
    return [];
  }
}

// Get user roles
export async function getUserRoles() {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*');
    
    if (error) throw error;
    
    // Convert the permissions from Json to string[]
    const roles = data.map(role => ({
      ...role,
      permissions: Array.isArray(role.permissions) 
        ? role.permissions 
        : typeof role.permissions === 'object' 
          ? Object.keys(role.permissions) 
          : []
    }));
    
    return roles || [];
  } catch (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
}

// Update a user role
export async function updateUserRole(id: string, roleData: Partial<UserRole>) {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .update(roleData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating user role:', error);
    return null;
  }
}

// Create a user role
export async function createUserRole(roleData: Partial<UserRole>) {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert(roleData)
      .select();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating user role:', error);
    return null;
  }
}

// Delete a user role
export async function deleteUserRole(id: string) {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting user role:', error);
    return false;
  }
}
