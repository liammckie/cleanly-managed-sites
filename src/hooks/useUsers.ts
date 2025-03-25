
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SystemUser } from '@/lib/types';
import { usersApi } from '@/lib/api/users';
import { toast } from 'sonner';

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
