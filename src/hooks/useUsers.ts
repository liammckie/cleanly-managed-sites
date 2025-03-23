
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
      console.log("Starting user creation process for:", userData.email);
      
      // Get the current authenticated user - needed for RLS policies
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error("You must be logged in to create users");
      }
      
      // Check if current user has admin permissions using service role or special function
      const { data: adminCheck, error: adminCheckError } = await supabase.rpc(
        'get_user_admin_status',
        { user_uuid: currentUser.id }
      );
      
      console.log("Admin check result:", adminCheck);
      
      // For non-admins, we need to use a different approach or show a permission error
      if (!adminCheck && adminCheckError) {
        console.error("Admin check failed:", adminCheckError);
        throw new Error("You don't have permission to create users");
      }
      
      // Use the authApi to handle the user creation
      const newUserProfile = await authApi.createUser(
        userData.email,
        userData.password,
        userData.full_name,
        userData.role_id
      );
      
      // Update local cache with new user
      queryClient.setQueryData(['users'], (oldData: SystemUser[] = []) => {
        // Get role info for the new user
        return [...oldData, {
          id: newUserProfile.id,
          email: newUserProfile.email,
          full_name: newUserProfile.full_name,
          role: {
            id: userData.role_id,
            name: '', // This will be populated when the query refreshes
            permissions: []
          },
          status: newUserProfile.status as 'active' | 'inactive' | 'pending',
          created_at: newUserProfile.created_at,
          updated_at: newUserProfile.updated_at,
          avatar_url: newUserProfile.avatar_url,
          phone: newUserProfile.phone,
          custom_id: newUserProfile.custom_id,
          note: newUserProfile.notes,
          territories: newUserProfile.territories
        }];
      });
      
      // Invalidate the users query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      toast.success('User created successfully. Check your email for confirmation link.');
      return newUserProfile;
    } catch (error: any) {
      console.error('Failed to create user:', error);
      
      // Provide more specific error messages based on the error
      let errorMessage = 'Failed to create user';
      if (error.message) {
        errorMessage = error.message;
        
        // Handle specific error types
        if (error.message.includes('duplicate key')) {
          errorMessage = 'A user with this email already exists';
        } else if (error.message.includes('permission denied')) {
          errorMessage = 'Permission denied. You may not have admin rights';
        } else if (error.message.includes('infinite recursion')) {
          errorMessage = 'Database policy error. Try logging out and back in';
        } else if (error.message.includes('policy')) {
          errorMessage = 'Database policy error. Make sure you have admin permissions';
        }
      }
      
      toast.error(`Failed to create user: ${errorMessage}`);
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
