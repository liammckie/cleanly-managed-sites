
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SystemUser, UserRole } from '@/lib/types';
import { toast } from 'sonner';

// Mock data for users (replace with actual API calls)
const mockUsers: SystemUser[] = [
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

// Mock function to fetch users (replace with actual implementation)
const fetchUsers = async (): Promise<SystemUser[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, you would fetch from Supabase or API
  // const { data, error } = await supabase
  //   .from('users')
  //   .select('*, roles(*)')
  
  return mockUsers;
};

// Function to create a user (mock implementation)
const createUserFn = async (userData: {
  email: string;
  full_name: string;
  role_id: string;
  password: string;
}): Promise<SystemUser> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, you would create user in Supabase
  // const { data, error } = await supabase
  //   .auth.admin.createUser({
  //     email: userData.email,
  //     password: userData.password,
  //     user_metadata: { full_name: userData.full_name }
  //   })
  
  // Then link to role in a separate table
  // await supabase.from('user_roles').insert({
  //   user_id: data.user.id,
  //   role_id: userData.role_id
  // })
  
  // Mock created user
  const mockRole = mockUsers.find(u => u.role.id === userData.role_id)?.role || {
    id: userData.role_id,
    name: 'User',
    permissions: ['sites:read', 'clients:read', 'contractors:read']
  };
  
  return {
    id: Date.now().toString(),
    email: userData.email,
    full_name: userData.full_name,
    role: mockRole,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export function useUsers() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return {
    users,
    isLoading,
    error,
  };
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  const createUser = async (userData: {
    email: string;
    full_name: string;
    role_id: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const newUser = await createUserFn(userData);
      
      // Update local cache with new user
      queryClient.setQueryData(['users'], (oldData: SystemUser[] = []) => {
        return [...oldData, newUser];
      });
      
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    createUser,
    isLoading,
  };
}
