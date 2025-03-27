
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users/index'; 
import { SystemUser } from '@/lib/types';

export const useUser = (userId?: string) => {
  const {
    data: user,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userId ? usersApi.getUserById(userId) : null,
    enabled: !!userId
  });

  return {
    user: user as SystemUser | null,
    isLoading,
    error,
    refetch
  };
};
