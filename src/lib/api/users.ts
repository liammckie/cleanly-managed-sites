
import { supabase } from '@/lib/supabase';
import { SystemUser, UserRole, UserStatus } from '@/lib/types/users';
import { v4 as uuidv4 } from 'uuid';

// Define a local type for user inserts
interface UserInsertData {
  email: string;
  firstName: string;
  lastName: string;
  full_name?: string;
  phone?: string;
  title?: string;
  role_id: string;
  status?: UserStatus;
  password?: string;
}

export const getUsers = async (): Promise<SystemUser[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('full_name');

    if (error) {
      throw error;
    }

    return data.map(user => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      title: user.title || '',
      status: user.status as UserStatus,
      role_id: user.role_id,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login,
      custom_id: user.custom_id,
      notes: user.notes,
      territories: user.territories || [], // Ensure it's an array
      daily_summary: user.daily_summary
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData: UserInsertData): Promise<SystemUser> => {
  try {
    const userId = uuidv4();
    
    // Create the user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: userData.email,
        full_name: userData.full_name || `${userData.firstName} ${userData.lastName}`,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone || '',
        title: userData.title || '',
        role_id: userData.role_id,
        status: userData.status || 'active',
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      throw profileError;
    }

    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone || '',
      title: profile.title || '',
      status: profile.status as UserStatus,
      role_id: profile.role_id,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      last_login: profile.last_login,
      custom_id: profile.custom_id,
      notes: profile.notes,
      territories: Array.isArray(profile.territories) ? profile.territories : [],
      daily_summary: profile.daily_summary
    };
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<SystemUser>): Promise<SystemUser | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone || '',
      title: data.title || '',
      status: data.status as UserStatus,
      role_id: data.role_id,
      avatar_url: data.avatar_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      last_login: data.last_login,
      custom_id: data.custom_id,
      notes: data.notes,
      territories: Array.isArray(data.territories) ? data.territories : [],
      daily_summary: data.daily_summary
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getCurrentUserProfile = async (): Promise<SystemUser | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching current user profile:', error);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone || '',
      title: data.title || '',
      status: data.status as UserStatus,
      role_id: data.role_id,
      avatar_url: data.avatar_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      last_login: data.last_login,
      custom_id: data.custom_id,
      notes: data.notes,
      territories: data.territories || [],
      daily_summary: data.daily_summary
    };
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    return null;
  }
};

export const getUserRoles = async (): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    // Convert permissions from Json to string[]
    return data.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: Array.isArray(role.permissions) 
        ? role.permissions as string[]
        : typeof role.permissions === 'object' && role.permissions !== null
          ? Object.keys(role.permissions)
          : [],
      created_at: role.created_at,
      updated_at: role.updated_at
    }));
  } catch (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
};

export const createUserRole = async (roleData: Omit<UserRole, 'id' | 'created_at' | 'updated_at'>): Promise<UserRole> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user role:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      permissions: Array.isArray(data.permissions) 
        ? data.permissions 
        : typeof data.permissions === 'object' && data.permissions !== null
          ? Object.keys(data.permissions)
          : [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error creating user role:', error);
    throw error;
  }
};

export const updateUserRole = async (id: string, roleData: Partial<UserRole>): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .update(roleData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      permissions: Array.isArray(data.permissions) 
        ? data.permissions 
        : typeof data.permissions === 'object' && data.permissions !== null
          ? Object.keys(data.permissions)
          : [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const deleteUserRole = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user role:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting user role:', error);
    throw error;
  }
};
