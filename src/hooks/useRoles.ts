
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRole, deleteRole, getRole, getRoles, updateRole } from '@/lib/api/users';
import { UserRole } from '@/lib/types/users';

export function useRoles() {
  const queryClient = useQueryClient();

  const { data: roles, isLoading, error, refetch } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const createRoleMutation = useMutation({
    mutationFn: (role: Partial<UserRole>) => createRole(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserRole> }) => updateRole(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', variables.id] });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
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
    queryFn: () => (id ? getRole(id) : Promise.reject('No role ID provided')),
    enabled: !!id,
  });

  return {
    role,
    isLoading,
    error,
  };
}
