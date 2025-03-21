
import { useWorkOrderFileOperations } from './googleDrive/useWorkOrderFileOperations';

/**
 * Hook for Google Drive file operations - Backwards compatibility wrapper
 * This hook maintains the original API for existing components while using the refactored implementation
 */
export const useGoogleDriveFileOperations = () => {
  const {
    uploadWorkOrderFile,
    downloadWorkOrderFile,
    deleteWorkOrderFile
  } = useWorkOrderFileOperations();

  return {
    uploadWorkOrderFile,
    downloadWorkOrderFile,
    deleteWorkOrderFile
  };
};
