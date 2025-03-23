
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/lib/types';

// Define an extended UserRole type with userCount
interface UserRoleWithCount extends UserRole {
  userCount?: number;
}

// Mock data for roles (replace with actual API calls)
const mockRoles: UserRoleWithCount[] = [
  {
    id: '1',
    name: 'Administrator',
    permissions: [
      'users:manage',
      'roles:manage',
      'sites:manage',
      'clients:manage',
      'contractors:manage',
      'work_orders:manage',
      'settings:manage'
    ],
    description: 'Full system access with all permissions',
    userCount: 1
  },
  {
    id: '2',
    name: 'Manager',
    permissions: [
      'sites:manage',
      'clients:manage',
      'contractors:read',
      'contractors:write',
      'work_orders:manage'
    ],
    description: 'Manage clients, sites and work orders',
    userCount: 1
  },
  {
    id: '3',
    name: 'User',
    permissions: [
      'sites:read',
      'clients:read',
      'contractors:read',
      'work_orders:read'
    ],
    description: 'Standard user with read-only access',
    userCount: 1
  }
];

// Mock function to fetch roles
const fetchRoles = async (): Promise<UserRoleWithCount[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, you would fetch from Supabase or API
  // const { data, error } = await supabase
  //   .from('roles')
  //   .select('*, users:user_roles(count)')
  
  return mockRoles;
};

// Mock function to create a role
const createRoleFn = async (roleData: {
  name: string;
  permissions: string[];
  description?: string;
}): Promise<UserRoleWithCount> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, you would create role in Supabase
  // const { data, error } = await supabase
  //   .from('roles')
  //   .insert(roleData)
  //   .select()
  //   .single()
  
  // Mock created role
  const newRole: UserRoleWithCount = {
    id: Date.now().toString(),
    name: roleData.name,
    permissions: roleData.permissions,
    description: roleData.description,
    userCount: 0
  };
  
  mockRoles.push(newRole);
  
  return newRole;
};

// Mock function to update a role
const updateRoleFn = async (
  roleId: string,
  roleData: {
    name?: string;
    permissions?: string[];
    description?: string;
  }
): Promise<UserRoleWithCount> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, you would update role in Supabase
  // const { data, error } = await supabase
  //   .from('roles')
  //   .update(roleData)
  //   .eq('id', roleId)
  //   .select()
  //   .single()
  
  // Mock update
  const role = mockRoles.find(r => r.id === roleId);
  if (!role) throw new Error('Role not found');
  
  const updatedRole: UserRoleWithCount = {
    ...role,
    ...roleData,
  };
  
  // Update the mock data (in a real app, this would be done via the queryClient)
  const roleIndex = mockRoles.findIndex(r => r.id === roleId);
  if (roleIndex !== -1) {
    mockRoles[roleIndex] = updatedRole;
  }
  
  return updatedRole;
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
    permissions: string[];
    description?: string;
  }) => {
    try {
      setIsLoading(true);
      const newRole = await createRoleFn(roleData);
      
      // Update local cache with new role
      queryClient.setQueryData<UserRoleWithCount[]>(['roles'], (oldData = []) => {
        return [...oldData, newRole];
      });
      
      return newRole;
    } catch (error) {
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
      permissions?: string[];
      description?: string;
    }
  ) => {
    try {
      setIsLoading(true);
      const updatedRole = await updateRoleFn(roleId, roleData);
      
      // Update local cache with updated role
      queryClient.setQueryData<UserRoleWithCount[]>(['roles'], (oldData = []) => {
        return oldData.map(r => r.id === roleId ? updatedRole : r);
      });
      
      return updatedRole;
    } catch (error) {
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
