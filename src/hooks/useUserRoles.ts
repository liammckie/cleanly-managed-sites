
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/lib/types';
import { toast } from 'sonner';
import { PermissionsMap, PermissionId } from '@/types/permissions';

// Define an extended UserRole type with userCount
interface UserRoleWithCount extends UserRole {
  userCount?: number;
}

// Convert PermissionsMap to string[] for the UI
const mapPermissionsToArray = (permissions: PermissionsMap): string[] => {
  return Object.entries(permissions)
    .filter(([_, value]) => value === true)
    .map(([key]) => key);
};

// Fetch user roles from Supabase
const fetchRoles = async (): Promise<UserRoleWithCount[]> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*');
  
  if (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
  
  // Get user count for each role
  const roles = await Promise.all(data.map(async (role) => {
    const { count, error: countError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role_id', role.id);
    
    return {
      id: role.id,
      name: role.name,
      permissions: mapPermissionsToArray(role.permissions as unknown as PermissionsMap),
      description: role.description,
      userCount: count || 0
    };
  }));
  
  return roles;
};

// Create a new role
const createRoleFn = async (roleData: {
  name: string;
  permissions: PermissionsMap;
  description?: string;
}): Promise<UserRoleWithCount> => {
  const { data, error } = await supabase
    .from('user_roles')
    .insert({
      name: roleData.name,
      permissions: roleData.permissions,
      description: roleData.description,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating role:', error);
    throw error;
  }
  
  return {
    id: data.id,
    name: data.name,
    permissions: mapPermissionsToArray(data.permissions as unknown as PermissionsMap),
    description: data.description,
    userCount: 0
  };
};

// Update an existing role
const updateRoleFn = async (
  roleId: string,
  roleData: {
    name?: string;
    permissions?: PermissionsMap;
    description?: string;
  }
): Promise<UserRoleWithCount> => {
  const { data, error } = await supabase
    .from('user_roles')
    .update(roleData)
    .eq('id', roleId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating role:', error);
    throw error;
  }
  
  // Get updated user count
  const { count } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role_id', data.id);
  
  return {
    id: data.id,
    name: data.name,
    permissions: mapPermissionsToArray(data.permissions as unknown as PermissionsMap),
    description: data.description,
    userCount: count || 0
  };
};

export function useUserRoles() {
  const { data: roles, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  });

  return {
    roles,
    isLoading,
    error,
  };
}

export function useRole(id?: string) {
  const { roles } = useUserRoles();
  const role = id ? roles?.find(r => r.id === id) : undefined;
  
  return { role };
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  const createRole = async (roleData: {
    name: string;
    permissions: PermissionsMap;
    description?: string;
  }) => {
    try {
      setIsLoading(true);
      const newRole = await createRoleFn(roleData);
      
      // Update local cache with new role
      queryClient.setQueryData<UserRoleWithCount[]>(['roles'], (oldData = []) => {
        return [...oldData, newRole];
      });
      
      toast.success('Role created successfully');
      return newRole;
    } catch (error: any) {
      toast.error(`Failed to create role: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    createRole,
    isLoading,
  };
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  const updateRole = async (
    roleId: string,
    roleData: {
      name?: string;
      permissions?: PermissionsMap;
      description?: string;
    }
  ) => {
    try {
      setIsLoading(true);
      const updatedRole = await updateRoleFn(roleId, roleData);
      
      // Update local cache with updated role
      queryClient.setQueryData<UserRoleWithCount[]>(['roles'], (oldData = []) => {
        return oldData?.map(r => r.id === roleId ? updatedRole : r) || [];
      });
      
      toast.success('Role updated successfully');
      return updatedRole;
    } catch (error: any) {
      toast.error(`Failed to update role: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    updateRole,
    isLoading,
  };
}
