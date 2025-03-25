
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SystemUser } from '@/lib/types';
import { usersApi } from '@/lib/api/users';
import { toast } from 'sonner';

export function useUsers() {
  const queryClient = useQueryClient();
  
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        return await usersApi.getAllUsers();
      } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
      }
    }
  });

  return {
    users: usersQuery.data as SystemUser[] || [],
    isLoading: usersQuery.isLoading,
    error: usersQuery.error as Error,
    refetch: usersQuery.refetch
  };
}

export function useUser(userId: string) {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      try {
        return await usersApi.getUserById(userId);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
      }
    },
    enabled: !!userId
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<SystemUser>) => {
      return await usersApi.updateUser(userId, userData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      toast.success('User updated successfully');
      return data;
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
      throw error;
    }
  });

  return {
    user: userQuery.data as SystemUser,
    isLoading: userQuery.isLoading,
    error: userQuery.error as Error,
    updateUser: updateUserMutation.mutateAsync,
    refetch: userQuery.refetch
  };
}

export const useUpdateUser = (userId: string) => {
  const { updateUser } = useUser(userId);
  return updateUser;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  const createUserMutation = useMutation({
    mutationFn: async (userData: Partial<SystemUser>) => {
      return await usersApi.createUser(userData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
      return data;
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
      toast.error('Failed to create user');
      throw error;
    }
  });
  
  return {
    createUser: createUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending
  };
};
