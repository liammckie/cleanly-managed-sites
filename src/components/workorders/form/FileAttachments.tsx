
import React, { useRef, useState } from 'react';
import { UploadIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useGoogleDriveFiles, WorkOrderAttachment } from '@/hooks/useGoogleDriveFiles';
import { DriveConnectionStatus } from './attachments/DriveConnectionStatus';
import { AttachmentList } from './attachments/AttachmentList';
import { DeleteFileDialog } from './attachments/DeleteFileDialog';

interface FileAttachmentsProps {
  workOrderId: string;
  workOrderTitle: string;
  attachments: WorkOrderAttachment[];
  onAttachmentsChange: (attachments: WorkOrderAttachment[]) => void;
  readOnly?: boolean;
}

export const FileAttachments = ({
  workOrderId,
  workOrderTitle,
  attachments,
  onAttachmentsChange,
  readOnly = false
}: FileAttachmentsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<WorkOrderAttachment | null>(null);
  const { 
    isConnected, 
    isCheckingConnection,
    uploadWorkOrderFile,
    downloadWorkOrderFile,
    deleteWorkOrderFile
  } = useGoogleDriveFiles();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      try {
        setIsUploading(true);
        const newAttachment = await uploadWorkOrderFile(workOrderId, workOrderTitle, file);
        onAttachmentsChange([...attachments, newAttachment]);
      } catch (error) {
        console.error('File upload error:', error);
      } finally {
        setIsUploading(false);
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleDownload = async (attachment: WorkOrderAttachment) => {
    try {
      await downloadWorkOrderFile(attachment);
    } catch (error) {
      console.error('File download error:', error);
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    
    try {
      await deleteWorkOrderFile(fileToDelete);
      const updatedAttachments = attachments.filter(a => a.id !== fileToDelete.id);
      onAttachmentsChange(updatedAttachments);
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    } catch (error) {
      console.error('File deletion error:', error);
    }
  };

  const confirmDelete = (attachment: WorkOrderAttachment) => {
    setFileToDelete(attachment);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <DriveConnectionStatus 
        isConnected={isConnected} 
        isCheckingConnection={isCheckingConnection} 
      />

      {isConnected && (
        <>
          <div className="flex justify-between items-center">
            <Label>Attachments</Label>
            {!readOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <UploadIcon className="h-4 w-4 mr-2" />
                )}
                Upload File
              </Button>
            )}
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isUploading || readOnly}
            />
          </div>

          <AttachmentList 
            attachments={attachments} 
            onDownload={handleDownload}
            onDelete={confirmDelete}
            readOnly={readOnly}
          />
          
          <DeleteFileDialog 
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            fileToDelete={fileToDelete}
            onConfirmDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};
