
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/types/users';

// Convert DB role to frontend role
const adaptUserRole = (dbRole: any): UserRole => {
  // Convert permissions array to permissions object for frontend
  const permissionsObject: Record<string, boolean> = {};
  
  // If dbRole.permissions is an array, convert it to object
  if (Array.isArray(dbRole.permissions)) {
    dbRole.permissions.forEach((permission: string) => {
      permissionsObject[permission] = true;
    });
  } else if (typeof dbRole.permissions === 'object' && dbRole.permissions !== null) {
    // If it's already an object, use it directly
    Object.assign(permissionsObject, dbRole.permissions);
  }
  
  return {
    id: dbRole.id,
    name: dbRole.name,
    description: dbRole.description,
    permissions: permissionsObject,
    created_at: dbRole.created_at,
    updated_at: dbRole.updated_at,
    user_count: 'user_count' in dbRole ? dbRole.user_count : undefined
  };
};

// Convert frontend role to DB role
const adaptUserRoleToApi = (role: UserRole): any => {
  // Convert permissions object to array for backend
  const permissionsArray: string[] = [];
  
  // Extract all permissions set to true
  Object.entries(role.permissions).forEach(([key, value]) => {
    if (value) {
      permissionsArray.push(key);
    }
  });
  
  return {
    id: role.id,
    name: role.name,
    description: role.description || '',
    permissions: permissionsArray,
    created_at: role.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

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

export function useUserRole(id: string) {
  return useQuery({
    queryKey: ['user-role', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return adaptUserRole(data);
    },
    enabled: !!id
  });
}
