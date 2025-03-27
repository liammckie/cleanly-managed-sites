
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, SystemUserInsert } from '@/lib/api/users/index';
import { SystemUser } from '@/lib/types';

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Get all users
  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers(),
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: SystemUserInsert) => usersApi.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SystemUser> }) => 
      usersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    createUserMutation,
    updateUserMutation
  };
};
