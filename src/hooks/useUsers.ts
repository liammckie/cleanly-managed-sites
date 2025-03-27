
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '@/lib/api/users';
import { validateWithZod } from '@/lib/validation';
import { userProfileSchema } from '@/lib/validation/userSchema';

export function useUsers() {
  const queryClient = useQueryClient();

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: (userData: any) => {
      // Validate user data before sending to API
      const validation = validateWithZod(userProfileSchema.partial(), userData);
      if (!validation.success) {
        throw new Error('Invalid user data: ' + Object.values(validation.errors || {}).join(', '));
      }
      return createUser(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create user: ${error.message}`);
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      // Validate user data before sending to API
      const validation = validateWithZod(userProfileSchema.partial(), data);
      if (!validation.success) {
        throw new Error('Invalid user data: ' + Object.values(validation.errors || {}).join(', '));
      }
      return updateUser(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update user: ${error.message}`);
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message}`);
    }
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
}

export function useUser(id?: string) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => (id ? getUserById(id) : Promise.reject('No user ID provided')),
    enabled: !!id,
  });

  return {
    user,
    isLoading,
    error,
  };
}
