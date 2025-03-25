
import { useErrorHandledQuery } from '@/hooks/useErrorHandledQuery';
import { usersApi } from '@/lib/api/users';
import { SystemUser } from '@/lib/types';

export function useUsers() {
  const usersQuery = useErrorHandledQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        return await usersApi.getUsers();
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    errorMessage: 'Failed to load users'
  });

  const userRolesQuery = useErrorHandledQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      try {
        // This would be implemented in userRolesApi
        // For now return a simple array
        return [{ id: '1', name: 'Admin' }, { id: '2', name: 'User' }];
      } catch (error) {
        console.error('Error fetching user roles:', error);
        throw error;
      }
    },
    errorMessage: 'Failed to load user roles'
  });

  return {
    users: usersQuery.data as SystemUser[] || [],
    userRoles: userRolesQuery.data || [],
    isLoading: usersQuery.isLoading || userRolesQuery.isLoading,
    isError: usersQuery.isError || userRolesQuery.isError,
    error: usersQuery.error || userRolesQuery.error
  };
}

// Export useUser for individual user lookups
export function useUser(userId: string) {
  const userQuery = useErrorHandledQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      try {
        return await usersApi.getUserById(userId);
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        throw error;
      }
    },
    errorMessage: 'Failed to load user details',
    enabled: !!userId
  });

  return {
    user: userQuery.data as SystemUser | undefined,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error
  };
}

// Export for backward compatibility
export { useCreateUser } from '@/lib/api/users';
