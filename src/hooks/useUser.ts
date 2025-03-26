
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { SystemUser } from '@/lib/types/userTypes';

// Hook to get a single user
export function useUser(userId?: string) {
  const queryClient = useQueryClient();
  
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userId ? usersApi.getUser(userId) : Promise.reject('No user ID provided'),
    enabled: !!userId
  });
  
  const updateUserMutation = useMutation({
    mutationFn: (data: Partial<SystemUser>) => 
      userId ? usersApi.updateUser(userId, data) : Promise.reject('No user ID provided'),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
      queryClient.invalidateQueries(['users']);
    }
  });
  
  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error as Error,
    updateUser: updateUserMutation.mutateAsync,
    refetch: userQuery.refetch
  };
}
