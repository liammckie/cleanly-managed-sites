
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SystemUser } from '@/lib/types';

// This is the same mock data as in useUsers.ts
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    full_name: 'Admin User',
    role: {
      id: '1',
      name: 'Administrator',
      permissions: [
        'users:manage',
        'roles:manage',
        'sites:manage',
        'clients:manage',
        'contractors:manage'
      ],
      description: 'Full system access'
    },
    status: 'active',
    last_login: new Date().toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    avatar_url: 'https://i.pravatar.cc/150?u=admin'
  },
  {
    id: '2',
    email: 'manager@example.com',
    full_name: 'Client Manager',
    role: {
      id: '2',
      name: 'Manager',
      permissions: [
        'sites:manage',
        'clients:manage',
        'contractors:read'
      ],
      description: 'Manage clients and sites'
    },
    status: 'active',
    last_login: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    avatar_url: 'https://i.pravatar.cc/150?u=manager'
  },
  {
    id: '3',
    email: 'user@example.com',
    full_name: 'Regular User',
    role: {
      id: '3',
      name: 'User',
      permissions: [
        'sites:read',
        'clients:read',
        'contractors:read'
      ],
      description: 'Standard user access'
    },
    status: 'pending',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Mock function to fetch a single user
const fetchUser = async (id?: string): Promise<SystemUser | null> => {
  if (!id) return null;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, you would fetch from Supabase or API
  // const { data, error } = await supabase
  //   .from('users')
  //   .select('*, roles(*)')
  //   .eq('id', id)
  //   .single()
  
  const user = mockUsers.find(user => user.id === id);
  return user || null;
};

// Mock function to update a user
const updateUserFn = async (userData: Partial<SystemUser> & { id: string }): Promise<SystemUser> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, you would update the user in Supabase
  // const { data, error } = await supabase
  //   .from('users')
  //   .update({
  //     full_name: userData.full_name,
  //     status: userData.status,
  //     // other fields...
  //   })
  //   .eq('id', userData.id)
  //   .select('*, roles(*)')
  //   .single()
  
  // Mock update
  const user = mockUsers.find(u => u.id === userData.id);
  if (!user) throw new Error('User not found');
  
  const updatedUser = {
    ...user,
    ...userData,
    updated_at: new Date().toISOString()
  };
  
  // Update the mock data (in a real app, this would be done via the queryClient)
  const userIndex = mockUsers.findIndex(u => u.id === userData.id);
  if (userIndex !== -1) {
    mockUsers[userIndex] = updatedUser;
  }
  
  return updatedUser;
};

export function useUser(id?: string) {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
  
  // Update user mutation
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateUserFn,
    onSuccess: (data) => {
      // Update the cache with the new user data
      queryClient.setQueryData(['user', id], data);
      
      // Update the users list if it exists in the cache
      queryClient.setQueryData(['users'], (oldData: SystemUser[] = []) => {
        return oldData.map(u => u.id === id ? data : u);
      });
    },
  });
  
  const updateUser = async (userData: Partial<SystemUser>) => {
    if (!id) throw new Error('User ID is required for update');
    return await mutateAsync({ ...userData, id });
  };
  
  return {
    user,
    isLoading: isLoading || isPending,
    error,
    updateUser,
  };
}
