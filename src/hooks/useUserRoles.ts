
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/types/users';

export function useUserRoles() {
  const rolesQuery = useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
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
        description: role.description || '',
        permissions: Array.isArray(role.permissions) 
          ? role.permissions 
          : typeof role.permissions === 'object' && role.permissions !== null
            ? Object.keys(role.permissions)
            : [],
        created_at: role.created_at,
        updated_at: role.updated_at
      })) as UserRole[];
    }
  });

  return {
    roles: rolesQuery.data || [],
    isLoading: rolesQuery.isLoading,
    error: rolesQuery.error as Error | null
  };
}
