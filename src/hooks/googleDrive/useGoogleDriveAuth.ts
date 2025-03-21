
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

/**
 * Hook for checking Google Drive connection status
 */
export const useGoogleDriveAuth = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
  // Check if the user has connected Google Drive
  const { isLoading: isCheckingConnection } = useQuery({
    queryKey: ['googleDriveConnection', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google_drive')
        .maybeSingle();
      
      if (error) {
        console.error('Error checking Google Drive connection:', error);
        setIsConnected(false);
        return false;
      }
      
      setIsConnected(!!data);
      return !!data;
    },
    enabled: !!user
  });

  return {
    isConnected,
    isCheckingConnection,
    user
  };
};
