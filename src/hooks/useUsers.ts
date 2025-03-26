
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { SystemUser } from '@/lib/types/userTypes';

// Hook to get all users
export function useUsers() {
  const queryClient = useQueryClient();
  
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers()
  });
  
  const createUserMutation = useMutation({
    mutationFn: (data: Partial<SystemUser>) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });
  
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });
  
  return {
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error as Error,
    createUser: createUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    refetch: usersQuery.refetch
  };
}

// Export the createUser function as a hook for compatibility
export function useCreateUser() {
  const { createUser } = useUsers();
  return createUser;
}
