
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/types/users';

export function useRoles() {
  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
        
      if (error) throw error;
      
      return data.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
        permissions: Array.isArray(role.permissions) 
          ? role.permissions 
          : Object.keys(role.permissions || {}),
        created_at: role.created_at,
        updated_at: role.updated_at
      })) as UserRole[];
    },
    meta: {
      errorMessage: 'Failed to fetch roles'
    }
  });

  return {
    roles: rolesQuery.data || [],
    isLoading: rolesQuery.isLoading,
    isError: rolesQuery.isError,
    error: rolesQuery.error as Error | null,
    refetch: rolesQuery.refetch
  };
}
