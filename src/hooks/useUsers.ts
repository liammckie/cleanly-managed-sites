
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SystemUser, SystemUserInsert } from '@/lib/types/users';
import { queryClient } from '@/lib/tanstack-query';

export function useUsers() {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');
        
      if (error) throw error;
        
      return data.map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        title: user.title || '',
        status: user.status as 'active' | 'pending' | 'inactive',
        role_id: user.role_id,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
        custom_id: user.custom_id,
        notes: user.notes,
        territories: user.territories,
        daily_summary: user.daily_summary
      })) as SystemUser[];
    },
    meta: {
      errorMessage: 'Failed to fetch users'
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: SystemUserInsert) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          email: userData.email,
          full_name: userData.full_name || `${userData.firstName} ${userData.lastName}`,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || '',
          title: userData.title || '',
          role_id: userData.role_id,
          status: userData.status || 'active'
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SystemUser> }) => {
      const { data: updatedUser, error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return updatedUser;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', data.id] });
    }
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    error: usersQuery.error as Error | null,
    refetch: usersQuery.refetch,
    createUserMutation,
    updateUserMutation
  };
}
