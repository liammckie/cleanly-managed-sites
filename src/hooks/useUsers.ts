
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { SystemUser } from '@/lib/types';

export const useUsers = () => {
  const queryClient = useQueryClient();
  
  // Query to fetch all users
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers(),
  });
  
  // Mutation to create a new user
  const createUserMutation = useMutation({
    mutationFn: (userData: Partial<SystemUser>) => usersApi.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  // Mutation to delete a user
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  return {
    users: data,
    isLoading,
    isError,
    error,
    createUser: createUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    refetch
  };
};

export const useUser = (userId: string) => {
  const queryClient = useQueryClient();
  
  // Query to fetch a single user
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId,
  });
  
  // Mutation to update a user
  const updateUserMutation = useMutation({
    mutationFn: (userData: Partial<SystemUser>) => usersApi.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  // Mutation to delete a user
  const deleteUserMutation = useMutation({
    mutationFn: () => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  return {
    user: data,
    isLoading,
    isError,
    error,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    refetch
  };
};

// This function combines the user data with operations for the UserDetail page
export const useUserWithOperations = (userId: string) => {
  const {
    user,
    isLoading,
    isError,
    error,
    updateUser,
    deleteUser,
    refetch
  } = useUser(userId);
  
  return {
    user,
    isLoading,
    isError,
    error,
    updateUser,
    deleteUser,
    refetch
  };
};
