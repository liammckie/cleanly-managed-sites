
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '@/lib/api/users';
import { validateWithZod } from '@/utils/zodValidation';
import { userProfileSchema } from '@/lib/validation/userSchema';
import { SystemUser } from '@/lib/types';

export function useUsers() {
  const queryClient = useQueryClient();
  
  // Query for fetching all users
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Mutation for creating a new user
  const createUserMutation = useMutation({
    mutationFn: async (userData: Partial<SystemUser>) => {
      const result = validateWithZod(userProfileSchema, userData);
      if (!result.success) {
        throw new Error(`Invalid user data: ${Object.values(result.errors).join(', ')}`);
      }
      // Make sure email is provided when creating a user
      if (!userData.email) {
        throw new Error("Email is required when creating a user");
      }
      return await usersApi.createUser({
        ...userData,
        email: userData.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create user: ${error.message}`);
    },
  });
  
  // Mutation for updating an existing user
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SystemUser> }) => {
      const result = validateWithZod(userProfileSchema.partial(), data);
      if (!result.success) {
        throw new Error(`Invalid user data: ${Object.values(result.errors).join(', ')}`);
      }
      return await usersApi.updateUser(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });
  
  // Mutation for deleting a user
  const deleteUserMutation = useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });
  
  return {
    users: users ? users.map(user => ({
      ...user,
      status: user.status as "active" | "pending" | "inactive"
    })) as SystemUser[] : undefined,
    isLoading,
    error,
    refetch,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
  };
}
