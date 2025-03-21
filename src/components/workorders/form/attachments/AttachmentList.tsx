
import React from 'react';
import { FileIcon, DownloadIcon, TrashIcon, ImageIcon, FileTextIcon, FileSpreadsheetIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkOrderAttachment } from '@/hooks/useGoogleDriveFiles';
import { formatBytes, getFileExtension, isImageFile } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AttachmentListProps {
  attachments: WorkOrderAttachment[];
  onDownload: (attachment: WorkOrderAttachment) => Promise<void>;
  onDelete: (attachment: WorkOrderAttachment) => void;
  readOnly?: boolean;
}

// Function to select the appropriate icon based on file type
const getFileTypeIcon = (fileName: string) => {
  const extension = getFileExtension(fileName).toLowerCase();
  
  if (isImageFile(fileName)) {
    return <ImageIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />;
  }
  
  if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
    return <FileTextIcon className="h-5 w-5 text-red-500 flex-shrink-0" />;
  }
  
  if (['xls', 'xlsx', 'csv'].includes(extension)) {
    return <FileSpreadsheetIcon className="h-5 w-5 text-green-500 flex-shrink-0" />;
  }
  
  return <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />;
};

export const AttachmentList = ({
  attachments,
  onDownload,
  onDelete,
  readOnly = false
}: AttachmentListProps) => {
  if (!attachments || attachments.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-3 border rounded-md text-center">
        No files attached
      </div>
    );
  }

  return (
    <ul className="border rounded-md divide-y">
      {attachments.map((attachment) => (
        <li key={attachment.id} className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
          <div className="flex items-center space-x-3 overflow-hidden">
            {getFileTypeIcon(attachment.name)}
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate" title={attachment.name}>{attachment.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatBytes(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload(attachment)}
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {!readOnly && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(attachment)}
                    >
                      <TrashIcon className="h-4 w-4 text-destructive" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
