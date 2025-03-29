
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserRole, UserStatus } from '@/types/db';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useUsers() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch users
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*, user_roles(*)');
      
      if (error) throw error;
      
      // Map the response to our UserProfile type
      return data.map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role_id: user.role_id,
        role: user.user_roles as UserRole,
        created_at: user.created_at,
        updated_at: user.updated_at,
        title: user.title,
        phone: user.phone,
        status: user.status as UserStatus,
        last_login: user.last_login,
        custom_id: user.custom_id,
        notes: user.notes,
        territories: user.territories,
        daily_summary: user.daily_summary
      }));
    }
  });
  
  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) => {
      // Ensure status is set
      const userWithStatus = {
        ...userData,
        id: uuidv4(), // Generate a UUID for new user
        status: userData.status || 'active' as UserStatus
      };
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(userWithStatus)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      setError(error);
      toast.error(`Failed to create user: ${error.message}`);
    }
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...userData }: Partial<UserProfile> & { id: string }) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(userData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      setError(error);
      toast.error(`Failed to update user: ${error.message}`);
    }
  });
  
  return {
    users,
    isLoading,
    error,
    refetch,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending
  };
}
