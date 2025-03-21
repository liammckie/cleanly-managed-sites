
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useGoogleDriveAuth } from './useGoogleDriveAuth';

/**
 * Hook for Google Drive file deletion operations
 */
export const useFileDelete = () => {
  const { user } = useGoogleDriveAuth();

  // Delete a file from Google Drive
  const deleteFileMutation = useMutation({
    mutationFn: async ({ fileId }: { fileId: string }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase.functions.invoke('google-drive-files', {
        body: {
          action: 'delete_file',
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
    deleteFile: deleteFileMutation.mutateAsync
  };
};
