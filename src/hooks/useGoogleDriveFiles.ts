
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const queryClient = useQueryClient();
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
      // Step 1: Create or get the work order folder
      const folderId = await createFolderMutation.mutateAsync({
        workOrderId,
        title: workOrderTitle
      });
      
      // Step 2: Get an upload URL
      const { fileId, uploadUrl } = await getUploadUrlMutation.mutateAsync({
        folderId,
        fileName: file.name,
        mimeType: file.type
      });
      
      // Step 3: Upload the file
      await uploadFileMutation.mutateAsync({ uploadUrl, file });
      
      // Step 4: Return the attachment metadata
      const attachment: WorkOrderAttachment = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        driveFileId: fileId,
        uploadedAt: new Date().toISOString()
      };
      
      return attachment;
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      toast.error('Failed to upload file');
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
      
      // Add the authorization token for the actual download
      // The user's browser will handle the download directly from Google Drive
      // This way the file never passes through our server
      window.open(downloadUrl, '_blank');
      
    } catch (error) {
      console.error('Error downloading file from Google Drive:', error);
      toast.error('Failed to download file');
      throw error;
    }
  };

  // Delete a file from a work order
  const deleteWorkOrderFile = async (attachment: WorkOrderAttachment): Promise<void> => {
    try {
      await deleteFileMutation.mutateAsync({
        fileId: attachment.driveFileId
      });
      
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file from Google Drive:', error);
      toast.error('Failed to delete file');
      throw error;
    }
  };

  return {
    isConnected,
    isCheckingConnection,
    uploadWorkOrderFile,
    downloadWorkOrderFile,
    deleteWorkOrderFile
  };
};
