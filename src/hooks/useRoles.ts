
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { UserRole } from '@/lib/types/users';

export function useRoles() {
  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      return await usersApi.getAllRoles();
    },
    meta: {
      errorMessage: 'Failed to fetch roles'
    }
  });

  return {
    roles: rolesQuery.data as UserRole[],
    isLoading: rolesQuery.isLoading,
    isError: rolesQuery.isError,
    error: rolesQuery.error,
    refetch: rolesQuery.refetch
  };
}
