
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/types/users';
import { v4 as uuidv4 } from 'uuid';
import { queryClient } from '@/lib/tanstack-query';
import { Json } from '@/lib/types';

export function useUserRoles() {
  const rolesQuery = useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      // Get user counts for each role - we need to do this as a separate query
      const { data: userCounts, error: countError } = await supabase
        .from('user_profiles')
        .select('role_id, count')
        .is('role_id', 'not.null')
        .then(async (res) => {
          if (res.error) throw res.error;
          
          // Group by role_id and count occurrences
          const counts: Record<string, number> = {};
          
          // Get the counts by executing a separate query
          const { data: countData, error: countErr } = await supabase
            .from('user_profiles')
            .select('role_id')
            .is('role_id', 'not.null');
            
          if (countErr) throw countErr;
          
          // Count occurrences of each role_id
          for (const row of countData || []) {
            if (row.role_id) {
              counts[row.role_id] = (counts[row.role_id] || 0) + 1;
            }
          }
          
          return { data: counts, error: null };
        });

      if (countError) {
        console.error('Error fetching role user counts:', countError);
      }

      // Convert permissions from Json to string[]
      return data.map(role => {
        // Find count for this role
        const userCount = userCounts?.[role.id] || 0;
        
        return {
          id: role.id,
          name: role.name,
          description: role.description || '',
          permissions: Array.isArray(role.permissions) 
            ? role.permissions.map(p => String(p)) 
            : typeof role.permissions === 'object' && role.permissions !== null
              ? Object.keys(role.permissions)
              : [],
          created_at: role.created_at,
          updated_at: role.updated_at,
          user_count: userCount
        };
      }) as UserRole[];
    }
  });

  return {
    roles: rolesQuery.data || [],
    isLoading: rolesQuery.isLoading,
    error: rolesQuery.error as Error | null
  };
}

export function useRole(roleId?: string) {
  const roleQuery = useQuery({
    queryKey: ['userRole', roleId],
    queryFn: async () => {
      if (!roleId) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('id', roleId)
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        permissions: Array.isArray(data.permissions) 
          ? data.permissions.map(p => String(p))
          : typeof data.permissions === 'object' && data.permissions !== null
            ? Object.keys(data.permissions)
            : [],
        created_at: data.created_at,
        updated_at: data.updated_at
      } as UserRole;
    },
    enabled: !!roleId,
    meta: {
      errorMessage: 'Failed to fetch role'
    }
  });

  return {
    role: roleQuery.data,
    isLoading: roleQuery.isLoading,
    isError: roleQuery.isError,
    error: roleQuery.error as Error | null
  };
}

export function useCreateRole() {
  const createRoleMutation = useMutation({
    mutationFn: async (roleData: { 
      name: string; 
      permissions: string[]; 
      description?: string 
    }) => {
      // Create a new role
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          id: uuidv4(),
          name: roleData.name,
          description: roleData.description || '',
          permissions: roleData.permissions
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate roles query to refetch
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
    }
  });

  return {
    createRole: createRoleMutation.mutateAsync,
    isLoading: createRoleMutation.isPending,
    error: createRoleMutation.error
  };
}

export function useUpdateRole() {
  const updateRoleMutation = useMutation({
    mutationFn: async ({ 
      roleId, 
      data
    }: { 
      roleId: string;
      data: { 
        name?: string; 
        permissions?: string[]; 
        description?: string 
      }
    }) => {
      const { data: responseData, error } = await supabase
        .from('user_roles')
        .update({
          name: data.name,
          description: data.description,
          permissions: data.permissions
        })
        .eq('id', roleId)
        .select()
        .single();
        
      if (error) throw error;
      return responseData;
    },
    onSuccess: () => {
      // Invalidate roles query to refetch
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
    }
  });

  return {
    updateRole: updateRoleMutation.mutateAsync,
    isLoading: updateRoleMutation.isPending,
    error: updateRoleMutation.error
  };
}
