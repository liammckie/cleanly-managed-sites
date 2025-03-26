
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SystemUser } from '@/lib/types/userTypes';
import { useCreateUser } from '@/hooks/useUsers';

export function useUserWithOperations(userId?: string) {
  const queryClient = useQueryClient();
  const createUser = useCreateUser();
  
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      // Placeholder for actual API call - would normally call usersApi.getUser(userId)
      if (!userId) return null;
      // Return mock data for now
      return {
        id: userId,
        email: 'user@example.com',
        first_name: 'John',
        last_name: 'Doe',
        full_name: 'John Doe',
        avatar_url: '',
        role: { id: '1', name: 'User', description: 'Regular user', permissions: [] },
        status: 'active' as const,
        phone: '',
        title: '',
        last_login: null,
        note: '',
        territories: [],
        custom_id: '',
      } as SystemUser;
    },
    enabled: !!userId
  });
  
  const updateUserMutation = useMutation({
    mutationFn: async (data: Partial<SystemUser>) => {
      // Placeholder for actual API call
      console.log('Updating user:', data);
      return { ...userQuery.data, ...data } as SystemUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error as Error,
    updateUser: updateUserMutation.mutateAsync,
    createUser,
    refetch: userQuery.refetch
  };
}

export function useUser(userId?: string) {
  return useUserWithOperations(userId);
}
