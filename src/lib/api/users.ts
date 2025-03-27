import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { SystemUser, UserRole, SystemUserInsert } from '@/lib/types/users';

const generateRandomPassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

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
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || '',
      title: user.title || '',
      status: user.status,
      role_id: user.role_id,
      avatarUrl: user.avatarUrl,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login,
      custom_id: user.custom_id,
      notes: user.notes,
      territories: user.territories,
      daily_summary: user.daily_summary
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData: SystemUserInsert): Promise<SystemUser> => {
  try {
    const { data: auth, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password || generateRandomPassword(),
      email_confirm: true,
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      throw authError;
    }

    const userId = auth.user?.id;
    
    if (!userId) {
      throw new Error('Failed to create user. No user ID returned.');
    }

    // Create the user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: userData.email,
        full_name: userData.full_name,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        title: userData.title,
        role_id: userData.role_id,
        status: userData.status || 'active',
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      throw profileError;
    }

    return {
      id: userId,
      email: userData.email,
      full_name: userData.full_name,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone || '',
      title: userData.title || '',
      status: userData.status || 'active',
      role_id: userData.role_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
      status: data.status,
      role_id: data.role_id,
      avatarUrl: data.avatarUrl,
      created_at: data.created_at,
      updated_at: data.updated_at,
      last_login: data.last_login,
      custom_id: data.custom_id,
      notes: data.notes,
      territories: data.territories,
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
    const user = await getCurrentUser();

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
      status: data.status,
      role_id: data.role_id,
      avatarUrl: data.avatarUrl,
      created_at: data.created_at,
      updated_at: data.updated_at,
      last_login: data.last_login,
      custom_id: data.custom_id,
      notes: data.notes,
      territories: data.territories,
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
        : Object.keys(role.permissions || {}),
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
      permissions: data.permissions,
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
      permissions: data.permissions,
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
