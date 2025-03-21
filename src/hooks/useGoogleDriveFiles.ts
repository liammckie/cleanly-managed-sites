
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { useGoogleDriveFileOperations } from './useGoogleDriveFileOperations';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  createdAt: string;
  webViewLink?: string;
}

export interface WorkOrderAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  driveFileId: string;
  uploadedAt: string;
}

export const useGoogleDriveFiles = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const { uploadWorkOrderFile, downloadWorkOrderFile, deleteWorkOrderFile } = useGoogleDriveFileOperations();
  
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
    uploadWorkOrderFile,
    downloadWorkOrderFile,
    deleteWorkOrderFile
  };
};
