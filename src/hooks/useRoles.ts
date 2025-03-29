
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '@/lib/api/users';
import { UserRole } from '@/lib/types/users';
import { validateWithZod } from '@/lib/validation';
import { userRoleSchema } from '@/lib/validation/userSchema';

export function useRoles() {
  const queryClient = useQueryClient();

  const { data: roles, isLoading, error, refetch } = useQuery({
    queryKey: ['roles'],
    queryFn: usersApi.getRoles,
  });

  const createRoleMutation = useMutation({
    mutationFn: (role: Partial<UserRole>) => {
      // Validate role data before sending to API
      const validation = validateWithZod(userRoleSchema.partial(), role);
      if (!validation.success) {
        throw new Error('Invalid role data: ' + Object.values(validation.errors || {}).join(', '));
      }
      return usersApi.createRole(role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create role: ${error.message}`);
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserRole> }) => {
      // Validate role data before sending to API
      const validation = validateWithZod(userRoleSchema.partial(), data);
      if (!validation.success) {
        throw new Error('Invalid role data: ' + Object.values(validation.errors || {}).join(', '));
      }
      return usersApi.updateRole(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', variables.id] });
      toast.success('Role updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update role: ${error.message}`);
    }
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => usersApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete role: ${error.message}`);
    }
  });

  return {
    roles,
    isLoading,
    error,
    refetch,
    createRole: createRoleMutation.mutate,
    updateRole: updateRoleMutation.mutate,
    deleteRole: deleteRoleMutation.mutate,
    isCreating: createRoleMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
    isDeleting: deleteRoleMutation.isPending,
  };
}

export function useRole(id?: string) {
  const { data: role, isLoading, error } = useQuery({
    queryKey: ['role', id],
    queryFn: () => (id ? usersApi.getRole(id) : Promise.reject('No role ID provided')),
    enabled: !!id,
  });

  return {
    role,
    isLoading,
    error,
  };
}
