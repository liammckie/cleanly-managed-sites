
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { SystemUser } from '@/lib/types/users';

export function useUser(userId: string) {
  const userQuery = useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      if (!userId) return null;
      return await usersApi.getUserById(userId);
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
    error: userQuery.error,
    refetch: userQuery.refetch
  };
}
