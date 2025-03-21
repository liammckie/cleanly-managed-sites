
import { useGoogleDriveAuth } from './googleDrive/useGoogleDriveAuth';
import { useWorkOrderFileOperations } from './googleDrive/useWorkOrderFileOperations';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  createdAt: string;
  webViewLink?: string;
}

// Make the interface compatible with Supabase's Json type
// by ensuring all properties use basic JSON-compatible types
export interface WorkOrderAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  driveFileId: string;
  uploadedAt: string;
  [key: string]: string | number | boolean | null; // Add index signature for Json compatibility
}

export const useGoogleDriveFiles = () => {
  const { isConnected, isCheckingConnection } = useGoogleDriveAuth();
  const { uploadWorkOrderFile, downloadWorkOrderFile, deleteWorkOrderFile } = useWorkOrderFileOperations();
  
  return {
    isConnected,
    isCheckingConnection,
    uploadWorkOrderFile,
    downloadWorkOrderFile,
    deleteWorkOrderFile
  };
};
