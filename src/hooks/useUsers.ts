
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { UserProfileWithRole } from '@/lib/types/users';
import { UserRole } from '@/types/db';

export function useUsers() {
  const [users, setUsers] = useState<UserProfileWithRole[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('*');
      
      if (usersError) throw usersError;
      
      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      // Map roles to users and convert to UserProfileWithRole
      const usersWithRoles = usersData.map(userProfile => {
        const userRole = rolesData.find(role => role.id === userProfile.role_id);
        
        return {
          ...userProfile,
          role: userRole || undefined
        } as UserProfileWithRole;
      });
      
      setUsers(usersWithRoles);
      setRoles(rolesData as UserRole[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
  }, [fetchUsers]);

  const updateUser = useCallback(async (userId: string, userData: Partial<UserProfileWithRole>) => {
    try {
      // Remove role from userData before sending to API
      const { role, ...userDataWithoutRole } = userData;
      
      const { error } = await supabase
        .from('user_profiles')
        .update(userDataWithoutRole)
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, ...userData } : user
        )
      );
      
      toast.success('User updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      return false;
    }
  }, []);

  const createUser = useCallback(async (userData: Omit<UserProfileWithRole, 'id'>) => {
    try {
      // Remove role from userData before sending to API
      const { role, ...userDataWithoutRole } = userData;
      
      // Add id field for Supabase insert
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          ...userDataWithoutRole,
          id: crypto.randomUUID() // Generate a new UUID
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add role back to user data for local state
      const newUser = {
        ...data,
        role
      } as UserProfileWithRole;
      
      // Update local state
      setUsers(prev => [...prev, newUser]);
      
      toast.success('User created successfully');
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
      return false;
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  return {
    users,
    roles,
    isLoading,
    isRefreshing,
    refreshUsers,
    updateUser,
    createUser
  };
}
