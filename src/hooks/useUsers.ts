
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users'; 
import { SystemUser } from '@/lib/types';

export function useUsers() {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        return await usersApi.getUsers();
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    }
  });

  const userRolesQuery = useQuery({
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
    }
  });

  return {
    users: usersQuery.data as SystemUser[] || [],
    userRoles: userRolesQuery.data || [],
    isLoading: usersQuery.isLoading || userRolesQuery.isLoading,
    isError: usersQuery.isError || userRolesQuery.isError,
    error: usersQuery.error || userRolesQuery.error
  };
}
