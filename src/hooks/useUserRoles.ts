
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/models';
import { adaptUserRole, adaptUserRoleToApi } from '@/utils/typeAdapters';

// Fetch all roles
const fetchRoles = async (): Promise<UserRole[]> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .order('name');

  if (error) throw error;

  // Count users per role
  const { data: userCounts, error: countError } = await supabase
    .from('user_profiles')
    .select('role_id, count(*)');

  if (countError) {
    console.error('Error fetching user counts:', countError);
  }

  // Create a map of role_id to count
  const countMap = (userCounts || []).reduce((acc: Record<string, number>, item: any) => {
    if (item.role_id) {
      acc[item.role_id] = parseInt(item.count);
    }
    return acc;
  }, {});

  // Transform the data with proper types and add user count
  return (data || []).map(role => {
    const transformedRole = {
      ...role,
      user_count: countMap[role.id] || 0
    };
    return adaptUserRole(transformedRole);
  });
};

export function useUserRoles() {
  const queryClient = useQueryClient();

  // Query roles
  const { data: roles, isLoading, error, refetch } = useQuery({
    queryKey: ['user-roles'],
    queryFn: fetchRoles
  });

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: async (role: Omit<UserRole, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert(adaptUserRoleToApi(role as UserRole))
        .select('*')
        .single();

      if (error) throw error;
      
      return adaptUserRole(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast.success('Role created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create role: ${error.message}`);
    }
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async (role: UserRole) => {
      const { data, error } = await supabase
        .from('user_roles')
        .update(adaptUserRoleToApi(role))
        .eq('id', role.id)
        .select('*')
        .single();

      if (error) throw error;
      
      return adaptUserRole(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast.success('Role updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update role: ${error.message}`);
    }
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast.success('Role deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete role: ${error.message}`);
    }
  });

  return {
    roles: roles || [],
    isLoading,
    error,
    createRole: createRoleMutation.mutate,
    updateRole: updateRoleMutation.mutate,
    deleteRole: deleteRoleMutation.mutate,
    isCreating: createRoleMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
    isDeleting: deleteRoleMutation.isPending,
    refetchRoles: refetch
  };
}
