
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WorkOrderAttachment } from '@/hooks/useGoogleDriveFiles';
import { toast } from "sonner";

interface DeleteFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileToDelete: WorkOrderAttachment | null;
  onConfirmDelete: () => Promise<void>;
}

export const DeleteFileDialog = ({
  open,
  onOpenChange,
  fileToDelete,
  onConfirmDelete
}: DeleteFileDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!fileToDelete) return;
    
    setIsDeleting(true);
    try {
      await onConfirmDelete();
      toast.success("File deleted successfully");
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error("Failed to delete file");
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>Cancel</Button>
          </DialogClose>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

