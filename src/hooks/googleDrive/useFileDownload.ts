
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useGoogleDriveAuth } from './useGoogleDriveAuth';

/**
 * Hook for Google Drive file download operations
 */
export const useFileDownload = () => {
  const { user } = useGoogleDriveAuth();

  // Get a download URL for a file
  const getDownloadUrlMutation = useMutation({
    mutationFn: async ({ fileId }: { fileId: string }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase.functions.invoke('google-drive-files', {
        body: {
          action: 'get_download_url',
          userId: user.id,
          fileId
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    }
  });

  return {
    getDownloadUrl: getDownloadUrlMutation.mutateAsync
  };
};
