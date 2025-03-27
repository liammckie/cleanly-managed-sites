
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SystemUser } from '@/lib/types/users';

export function useUser(userId: string) {
  const userQuery = useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        title: data.title || '',
        status: data.status as 'active' | 'pending' | 'inactive',
        role_id: data.role_id,
        avatar_url: data.avatar_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        last_login: data.last_login,
        custom_id: data.custom_id,
        notes: data.notes,
        territories: data.territories,
        daily_summary: data.daily_summary
      } as SystemUser;
    },
    enabled: !!userId,
    meta: {
      errorMessage: 'Failed to fetch user'
    }
  });

  return {
    user: userQuery.data as SystemUser | null,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error as Error | null,
    refetch: userQuery.refetch
  };
}
