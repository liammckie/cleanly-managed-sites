
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useGoogleDriveAuth } from './useGoogleDriveAuth';
import { getMimeTypeFromExtension } from '@/lib/fileUtils';

/**
 * Hook for Google Drive file upload operations
 */
export const useFileUpload = () => {
  const { user } = useGoogleDriveAuth();

  // Get an upload URL for a file
  const getUploadUrlMutation = useMutation({
    mutationFn: async ({ 
      folderId, 
      fileName, 
      mimeType 
    }: { 
      folderId: string; 
      fileName: string; 
      mimeType: string;
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase.functions.invoke('google-drive-files', {
        body: {
          action: 'get_upload_url',
          userId: user.id,
          fileInfo: { folderId, fileName, mimeType }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    }
  });

  // Upload a file using the provided upload URL
  const uploadFileMutation = useMutation({
    mutationFn: async ({ 
      uploadUrl, 
      file 
    }: { 
      uploadUrl: string; 
      file: File;
    }) => {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      return true;
    }
  });

  return {
    getUploadUrl: getUploadUrlMutation.mutateAsync,
    uploadFile: uploadFileMutation.mutateAsync
  };
};
