
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfileWithRole } from '@/lib/types/users';

export const useUser = (userId: string) => {
  const [user, setUser] = useState<UserProfileWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (userError) throw userError;

        // Fetch role if user has one
        let roleData = null;
        if (userData.role_id) {
          const { data, error: roleError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('id', userData.role_id)
            .single();
          
          if (roleError && roleError.code !== 'PGRST116') { // Not found is OK
            throw roleError;
          }
          
          roleData = data;
        }

        // Combine user and role data
        setUser({
          ...userData,
          role: roleData
        } as UserProfileWithRole);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, isLoading, error };
};

export default useUser;
