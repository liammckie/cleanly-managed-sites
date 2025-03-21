
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useGoogleDriveAuth } from './useGoogleDriveAuth';

/**
 * Hook for Google Drive folder operations
 */
export const useFolderOperations = () => {
  const { user } = useGoogleDriveAuth();

  // Create a folder for a work order
  const createFolderMutation = useMutation({
    mutationFn: async ({ workOrderId, title }: { workOrderId: string; title: string }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase.functions.invoke('google-drive-files', {
        body: {
          action: 'create_folder',
          userId: user.id,
          workOrderId,
          fileInfo: { title }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    }
  });

  return {
    createFolder: createFolderMutation.mutateAsync
  };
};
