
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi, SystemUserInsert } from '@/lib/api/users';
import { SystemUser } from '@/lib/types/users';
import { toast } from 'sonner';

export function useUsers() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
  });

  const { mutateAsync: createUser } = useMutation({
    mutationFn: (userData: Partial<SystemUser>) => 
      usersApi.createUser(userData as SystemUserInsert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create user: ${error.message}`);
    },
  });

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });

  return {
    users,
    isLoading,
    isError,
    error,
    createUser,
    deleteUser,
    refetch,
  };
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Partial<SystemUser>) => 
      usersApi.createUser(userData as SystemUserInsert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create user: ${error.message}`);
    },
  });
}
