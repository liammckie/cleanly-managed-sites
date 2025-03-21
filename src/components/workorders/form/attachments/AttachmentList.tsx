
import React from 'react';
import { FileIcon, DownloadIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkOrderAttachment } from '@/hooks/useGoogleDriveFiles';
import { formatBytes } from '@/lib/utils';

interface AttachmentListProps {
  attachments: WorkOrderAttachment[];
  onDownload: (attachment: WorkOrderAttachment) => Promise<void>;
  onDelete: (attachment: WorkOrderAttachment) => void;
  readOnly?: boolean;
}

export const AttachmentList = ({
  attachments,
  onDownload,
  onDelete,
  readOnly = false
}: AttachmentListProps) => {
  if (attachments.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-3 border rounded-md text-center">
        No files attached
      </div>
    );
  }

  return (
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
              onClick={() => onDownload(attachment)}
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
            {!readOnly && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onDelete(attachment)}
              >
                <TrashIcon className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
