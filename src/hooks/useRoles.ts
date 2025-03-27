
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/models';
import { toast } from 'sonner';

export function useRoles() {
  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
        
      if (error) throw error;
      
      return data.map(role => {
        // Convert permissions from JSON to Record<string, boolean>
        const permissions: Record<string, boolean> = {};
        
        if (typeof role.permissions === 'object' && role.permissions !== null) {
          Object.entries(role.permissions).forEach(([key, value]) => {
            permissions[key] = Boolean(value);
          });
        } else if (Array.isArray(role.permissions)) {
          role.permissions.forEach(perm => {
            if (typeof perm === 'string') {
              permissions[perm] = true;
            }
          });
        }
        
        return {
          id: role.id,
          name: role.name,
          description: role.description || '',
          permissions,
          created_at: role.created_at,
          updated_at: role.updated_at,
          user_count: role.user_count || 0
        };
      }) as UserRole[];
    },
    meta: {
      errorMessage: 'Failed to fetch roles'
    }
  });

  const createRoleMutation = useMutation({
    mutationFn: async (roleData: {
      name: string;
      description?: string;
      permissions: Record<string, boolean>;
    }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Role created successfully');
      rolesQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: {
        name?: string;
        description?: string;
        permissions?: Record<string, boolean>;
      }
    }) => {
      const { data: responseData, error } = await supabase
        .from('user_roles')
        .update(data)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return responseData;
    },
    onSuccess: () => {
      toast.success('Role updated successfully');
      rolesQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast.success('Role deleted successfully');
      rolesQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return {
    roles: rolesQuery.data || [],
    isLoading: rolesQuery.isLoading,
    isError: rolesQuery.isError,
    error: rolesQuery.error as Error | null,
    refetch: rolesQuery.refetch,
    refetchRoles: rolesQuery.refetch,
    createRole: createRoleMutation.mutateAsync,
    updateRole: updateRoleMutation.mutateAsync,
    deleteRole: deleteRoleMutation.mutateAsync
  };
}
