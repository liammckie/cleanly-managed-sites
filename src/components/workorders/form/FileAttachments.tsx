
import React, { useRef, useState } from 'react';
import { 
  FileIcon, 
  UploadIcon, 
  TrashIcon, 
  DownloadIcon, 
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoogleDriveFiles, WorkOrderAttachment } from '@/hooks/useGoogleDriveFiles';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatBytes } from '@/lib/utils';

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

  if (isCheckingConnection) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <Alert variant="warning" className="mb-4">
        <AlertTitle>Google Drive not connected</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            To upload and manage files for work orders, you need to connect your Google Drive account.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/integrations?tab=google-drive'}
          >
            Connect Google Drive
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
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

      {attachments.length === 0 ? (
        <div className="text-sm text-muted-foreground py-3 border rounded-md text-center">
          No files attached
        </div>
      ) : (
        <ul className="border rounded-md divide-y">
          {attachments.map((attachment) => (
            <li key={attachment.id} className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(attachment)}
                >
                  <DownloadIcon className="h-4 w-4" />
                </Button>
                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDelete(attachment)}
                  >
                    <TrashIcon className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
