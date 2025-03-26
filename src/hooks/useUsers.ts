
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SystemUser } from '@/lib/types/userTypes';

export function useUsers() {
  const queryClient = useQueryClient();
  
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Placeholder for actual API call
      return [
        {
          id: '1',
          email: 'user1@example.com',
          first_name: 'John',
          last_name: 'Doe',
          full_name: 'John Doe',
          avatar_url: '',
          role: { id: '1', name: 'Admin', description: 'Administrator', permissions: [] },
          status: 'active' as const,
          phone: '',
          title: '',
          last_login: null,
          note: '',
          territories: [],
          custom_id: '',
        }
      ] as SystemUser[];
    }
  });
  
  const createUserMutation = useMutation({
    mutationFn: async (data: Partial<SystemUser>) => {
      // Placeholder for actual API call
      console.log('Creating user:', data);
      return {
        id: crypto.randomUUID(),
        ...data,
        full_name: `${data.first_name} ${data.last_name}`,
        avatar_url: data.avatar_url || '',
        last_login: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as SystemUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Placeholder for actual API call
      console.log('Deleting user:', userId);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  return {
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error as Error,
    createUser: createUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    deleteUser: deleteUserMutation.mutateAsync,
    refetch: usersQuery.refetch
  };
}

// Export the createUser function as a hook for compatibility
export function useCreateUser() {
  const { createUser, isCreating } = useUsers();
  return { createUser, isCreating };
}
