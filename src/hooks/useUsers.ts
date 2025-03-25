
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, SystemUser } from '@/lib/api/users';
import { useState } from 'react';

export function useUsers() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers
  });

  return { users: data, isLoading, error };
}

export function useUser(userId: string) {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getUser(userId),
    enabled: !!userId
  });

  const updateUserMutation = useMutation({
    mutationFn: (userData: Partial<SystemUser>) => {
      setIsUpdating(true);
      return usersApi.updateUser(userId, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsUpdating(false);
    },
    onError: () => {
      setIsUpdating(false);
    }
  });

  const updateUser = async (userData: Partial<SystemUser>) => {
    return updateUserMutation.mutateAsync(userData);
  };

  return {
    user: data as SystemUser,
    isLoading,
    error,
    updateUser,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['user', userId] })
  };
}

export function useCreateUser() {
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: (userData: Partial<SystemUser>) => {
      setIsCreating(true);
      return usersApi.createUser(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreating(false);
    },
    onError: () => {
      setIsCreating(false);
    }
  });

  return {
    createUser: createUserMutation.mutateAsync,
    isCreating
  };
}
