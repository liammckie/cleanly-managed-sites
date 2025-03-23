
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SystemUser, UserRole } from '@/lib/types';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/authApi';

// Fetch users from Supabase
const fetchUsers = async (): Promise<SystemUser[]> => {
  try {
    const { data: usersData, error: usersError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }
    
    // Fetch all roles in one query to avoid n+1 problem
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');
    
    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      throw rolesError;
    }
    
    // Build a map of role id to role for fast lookup
    const rolesMap = rolesData.reduce((acc, role) => {
      acc[role.id] = {
        id: role.id,
        name: role.name,
        permissions: Object.keys(role.permissions).filter(key => 
          role.permissions[key] === true
        ),
        description: role.description
      };
      return acc;
    }, {} as Record<string, UserRole>);
    
    // Map user data to our SystemUser type
    const users = usersData.map(user => {
      const role = user.role_id ? rolesMap[user.role_id] : {
        id: '',
        name: 'No Role Assigned',
        permissions: [],
      };
      
      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role,
        status: user.status as 'active' | 'inactive' | 'pending',
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at,
        avatar_url: user.avatar_url,
        phone: user.phone,
        custom_id: user.custom_id,
        note: user.notes,
        territories: user.territories
      };
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Function to create a user - now delegates to authApi
const createUserFn = async (userData: {
  email: string;
  full_name: string;
  role_id: string;
  password: string;
}): Promise<SystemUser> => {
  try {
    console.log("Creating user via authApi:", userData.email);
    // Use the authApi to handle the user creation
    const profileData = await authApi.createUser(
      userData.email,
      userData.password,
      userData.full_name,
      userData.role_id
    );
    
    // Fetch the role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('id', userData.role_id)
      .single();
    
    if (roleError) {
      console.error('Error fetching role:', roleError);
      throw roleError;
    }
    
    // Return a proper SystemUser object
    return {
      id: profileData.id,
      email: profileData.email,
      full_name: profileData.full_name,
      role: {
        id: roleData.id,
        name: roleData.name,
        permissions: Object.keys(roleData.permissions).filter(key => 
          roleData.permissions[key] === true
        ),
        description: roleData.description
      },
      status: profileData.status as 'active' | 'inactive' | 'pending',
      created_at: profileData.created_at,
      updated_at: profileData.updated_at,
      avatar_url: profileData.avatar_url,
      phone: profileData.phone,
      custom_id: profileData.custom_id,
      note: profileData.notes,
      territories: profileData.territories
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export function useUsers() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return {
    users,
    isLoading,
    error,
  };
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  const createUser = async (userData: {
    email: string;
    full_name: string;
    role_id: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const newUser = await createUserFn(userData);
      
      // Update local cache with new user
      queryClient.setQueryData(['users'], (oldData: SystemUser[] = []) => {
        return [...oldData, newUser];
      });
      
      toast.success('User created successfully. Check your email for confirmation link.');
      return newUser;
    } catch (error: any) {
      console.error('Failed to create user:', error);
      toast.error(`Failed to create user: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    createUser,
    isLoading,
  };
}
