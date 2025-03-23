
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SystemUser, UserRole } from '@/lib/types';
import { toast } from 'sonner';
import { PermissionsMap } from '@/types/permissions';

// Fetch a single user from Supabase
const fetchUser = async (id?: string): Promise<SystemUser | null> => {
  if (!id) return null;
  
  const { data: userData, error: userError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (userError) {
    console.error('Error fetching user:', userError);
    throw userError;
  }

  if (!userData) return null;
  
  // Fetch the user's role
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('*')
    .eq('id', userData.role_id)
    .single();
  
  if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error fetching user role:', roleError);
    throw roleError;
  }
  
  // Extract first and last name from full_name if they don't exist
  const firstName = userData.first_name || '';
  const lastName = userData.last_name || '';
  
  // Map the data to our SystemUser type
  const user: SystemUser = {
    id: userData.id,
    email: userData.email,
    full_name: userData.full_name,
    first_name: firstName,
    last_name: lastName,
    phone: userData.phone,
    title: userData.title || '',
    role: roleData ? {
      id: roleData.id,
      name: roleData.name,
      permissions: Object.keys(roleData.permissions).filter(key => 
        roleData.permissions[key] === true
      ),
      description: roleData.description
    } : {
      id: '',
      name: 'No Role Assigned',
      permissions: [],
    },
    status: userData.status as 'active' | 'inactive' | 'pending',
    last_login: userData.last_login,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
    avatar_url: userData.avatar_url,
    custom_id: userData.custom_id,
    note: userData.notes,
    territories: userData.territories
  };
  
  return user;
};

// Update a user in Supabase
const updateUserFn = async (userData: Partial<SystemUser> & { id: string }): Promise<SystemUser> => {
  // Check if we need to update the role
  const updateData: any = {
    full_name: userData.full_name,
    email: userData.email,
    status: userData.status,
  };
  
  if (userData.first_name !== undefined) {
    updateData.first_name = userData.first_name;
  }
  
  if (userData.last_name !== undefined) {
    updateData.last_name = userData.last_name;
  }
  
  if (userData.role && userData.role.id) {
    updateData.role_id = userData.role.id;
  }
  
  if (userData.phone !== undefined) {
    updateData.phone = userData.phone;
  }
  
  if (userData.title !== undefined) {
    updateData.title = userData.title;
  }
  
  if (userData.custom_id !== undefined) {
    updateData.custom_id = userData.custom_id;
  }
  
  if (userData.note !== undefined) {
    updateData.notes = userData.note;
  }
  
  if (userData.territories !== undefined) {
    updateData.territories = userData.territories;
  }
  
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('id', userData.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user:', error);
    throw error;
  }
  
  // Fetch the updated user to return
  return await fetchUser(userData.id) as SystemUser;
};

export function useUser(id?: string) {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
  
  // Update user mutation
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateUserFn,
    onSuccess: (data) => {
      // Update the cache with the new user data
      queryClient.setQueryData(['user', id], data);
      
      // Update the users list if it exists in the cache
      queryClient.setQueryData(['users'], (oldData: SystemUser[] = []) => {
        return oldData.map(u => u.id === id ? data : u);
      });
      
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating user: ${error.message}`);
    }
  });
  
  const updateUser = async (userData: Partial<SystemUser>) => {
    if (!id) throw new Error('User ID is required for update');
    return await mutateAsync({ ...userData, id });
  };
  
  return {
    user,
    isLoading: isLoading || isPending,
    error,
    updateUser,
  };
}
