
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SystemUser } from '@/lib/types';
import { usersApi } from '@/lib/api/users/index';

// Hook for fetching all users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersApi.fetchUsers
  });
};

// Hook for fetching a specific user by ID
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersApi.fetchUserById(userId),
    enabled: !!userId
  });
};

// Hook for user operations (create, update, delete)
export const useUserOperations = () => {
  const queryClient = useQueryClient();
  
  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: Partial<SystemUser>) => usersApi.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: Partial<SystemUser> }) => 
      usersApi.updateUser(userId, userData),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', updatedUser.id] });
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  return {
    createUser: createUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending
  };
};

// Combined hook with a specific user's data and operations for that user
export const useUserWithOperations = (userId: string) => {
  const { data: user, isLoading, isError, error } = useUser(userId);
  const { updateUser, isUpdating, deleteUser, isDeleting } = useUserOperations();
  const queryClient = useQueryClient();
  
  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ['users', userId] });
  };
  
  return {
    user,
    isLoading,
    isError,
    error,
    updateUser,
    isUpdating,
    deleteUser,
    isDeleting,
    refetch
  };
};
