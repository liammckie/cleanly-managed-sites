import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { SystemUser, SystemUserInsert, UserRole, adaptUserFromDb, adaptUserRoleFromDb } from '@/lib/types/users';

export const getUsers = async (): Promise<SystemUser[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*, role:user_roles(*)')
      .order('full_name', { ascending: true });

    if (error) {
      throw error;
    }

    return data.map(user => adaptUserFromDb(user));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData: SystemUserInsert): Promise<SystemUser> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userData.id || uuidv4(),
        email: userData.email,
        full_name: userData.full_name,
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar_url: userData.avatar_url,
        title: userData.title,
        phone: userData.phone,
        custom_id: userData.custom_id,
        notes: userData.notes, // Use notes, not note
        territories: userData.territories,
        status: userData.status || 'active',
        role_id: userData.role_id,
        daily_summary: userData.daily_summary
      })
      .select('*')
      .single();
      
    if (error) throw error;
    
    return adaptUserFromDb(data);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<SystemUser>): Promise<SystemUser> => {
  try {
    // Check if we need to convert note to notes
    if (userData.notes !== undefined) {
      // Make sure we use notes, not note
      userData.notes = userData.notes;
    }
    
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
        notes: userData.notes, // Use notes, not note
        territories: userData.territories,
        status: userData.status,
        role_id: userData.role_id,
        updated_at: new Date().toISOString(),
        daily_summary: userData.daily_summary
      })
      .eq('id', userId)
      .select('*')
      .single();
      
    if (error) throw error;
    
    return adaptUserFromDb(data);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getRoles = async (): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*');

    if (error) {
      throw error;
    }

    return data.map(role => adaptUserRoleFromDb(role as any));
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const getRole = async (id: string): Promise<UserRole> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return adaptUserRoleFromDb(data as any);
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
};

export const createRole = async (role: Omit<UserRole, 'id'>): Promise<UserRole> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert([role])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return adaptUserRoleFromDb(data as any);
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRole = async (role: UserRole): Promise<UserRole> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .update(role)
      .eq('id', role.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return adaptUserRoleFromDb(data as any);
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<SystemUser> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*, role:user_roles(*)')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    // Fix any note/notes inconsistency here
    if (data.note && !data.notes) {
      data.notes = data.note;
    }
    
    return adaptUserFromDb(data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
