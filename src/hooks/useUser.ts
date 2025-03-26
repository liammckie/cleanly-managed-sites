
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { SystemUser } from '@/lib/types/users';
import { useCreateUser } from '@/hooks/useUsers';
import { toast } from 'sonner';

export function useUser(userId: string) {
  const queryClient = useQueryClient();

  const { 
    data: user, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId,
  });

  const { mutateAsync: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: (userData: Partial<SystemUser>) => usersApi.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  const { mutateAsync: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: () => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });

  return {
    user,
    isLoading,
    isError,
    isUpdating,
    isDeleting,
    error,
    updateUser,
    deleteUser,
    refetch,
  };
}

export { useCreateUser };
