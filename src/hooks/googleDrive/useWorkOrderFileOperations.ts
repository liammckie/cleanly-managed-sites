
import { WorkOrderAttachment } from '@/hooks/useGoogleDriveFiles';
import { useFolderOperations } from './useFolderOperations';
import { useFileUpload } from './useFileUpload';
import { useFileDownload } from './useFileDownload';
import { useFileDelete } from './useFileDelete';
import { toast } from 'sonner';
import { getMimeTypeFromExtension } from '@/lib/fileUtils';

/**
 * Hook that combines all file operations specifically for work orders
 */
export const useWorkOrderFileOperations = () => {
  const { createFolder } = useFolderOperations();
  const { getUploadUrl, uploadFile } = useFileUpload();
  const { getDownloadUrl } = useFileDownload();
  const { deleteFile } = useFileDelete();

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
      const folderId = await createFolder({
        workOrderId,
        title: workOrderTitle
      });
      
      // Step 2: Get an upload URL
      const { fileId, uploadUrl } = await getUploadUrl({
        folderId,
        fileName: file.name,
        mimeType
      });
      
      // Step 3: Upload the file
      await uploadFile({ uploadUrl, file });
      
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
      const downloadUrl = await getDownloadUrl({
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
      await deleteFile({
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
