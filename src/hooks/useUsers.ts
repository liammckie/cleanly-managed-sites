
import { useMutation, useQuery } from '@tanstack/react-query';
import { usersApi, SystemUserInsert } from '@/lib/api/users';
import { SystemUser } from '@/lib/types/users';
import { queryClient } from '@/lib/tanstack-query';

export function useUsers() {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return await usersApi.getAllUsers();
    },
    meta: {
      errorMessage: 'Failed to fetch users'
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: SystemUserInsert) => {
      return await usersApi.createUser(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SystemUser> }) => {
      return await usersApi.updateUser(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', data.id] });
    }
  });

  return {
    users: usersQuery.data as SystemUser[],
    isLoading: usersQuery.isLoading,
    error: usersQuery.error as Error | null,
    refetch: usersQuery.refetch,
    createUserMutation,
    updateUserMutation
  };
}
