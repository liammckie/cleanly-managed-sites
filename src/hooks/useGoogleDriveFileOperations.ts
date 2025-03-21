
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import { WorkOrderAttachment } from './useGoogleDriveFiles';
import { getMimeTypeFromExtension } from '@/lib/utils';

/**
 * Hook for Google Drive file operations
 * This is a companion hook to useGoogleDriveFiles that focuses on file operations
 */
export const useGoogleDriveFileOperations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  // Upload a file to a work order folder
  const uploadWorkOrderFile = async (
    workOrderId: string,
    workOrderTitle: string,
    file: File
  ): Promise<WorkOrderAttachment> => {
    try {
      // Determine MIME type if it's not set properly
      const mimeType = file.type || getMimeTypeFromExtension(file.name);
      
      // Step 1: Create or get the work order folder
      const folderId = await createFolderMutation.mutateAsync({
        workOrderId,
        title: workOrderTitle
      });
      
      // Step 2: Get an upload URL
      const { fileId, uploadUrl } = await getUploadUrlMutation.mutateAsync({
        folderId,
        fileName: file.name,
        mimeType
      });
      
      // Step 3: Upload the file
      await uploadFileMutation.mutateAsync({ uploadUrl, file });
      
      // Step 4: Return the attachment metadata
      // Make sure all properties are JSON-compatible
      const attachment: WorkOrderAttachment = {
        id: crypto.randomUUID(),
        name: file.name,
        type: mimeType,
        size: file.size,
        driveFileId: fileId,
        uploadedAt: new Date().toISOString()
      };
      
      return attachment;
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to upload file: ${errorMessage}`);
      throw error;
    }
  };

  // Download a file from a work order
  const downloadWorkOrderFile = async (attachment: WorkOrderAttachment): Promise<void> => {
    try {
      // Get the download URL
      const downloadUrl = await getDownloadUrlMutation.mutateAsync({
        fileId: attachment.driveFileId
      });
      
      // Open the download URL in a new tab
      window.open(downloadUrl, '_blank');
      
    } catch (error) {
      console.error('Error downloading file from Google Drive:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to download file: ${errorMessage}`);
      throw error;
    }
  };

  // Delete a file from a work order
  const deleteWorkOrderFile = async (attachment: WorkOrderAttachment): Promise<void> => {
    try {
      await deleteFileMutation.mutateAsync({
        fileId: attachment.driveFileId
      });
      
    } catch (error) {
      console.error('Error deleting file from Google Drive:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to delete file: ${errorMessage}`);
      throw error;
    }
  };

  return {
    uploadWorkOrderFile,
    downloadWorkOrderFile,
    deleteWorkOrderFile
  };
};
