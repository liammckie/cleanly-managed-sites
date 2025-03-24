
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContractorDocument } from '@/lib/api/contractors/contractorHistoryApi';

interface DeleteDocumentDialogProps {
  document: ContractorDocument;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteDocumentDialog = ({ 
  document, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteDocumentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Document</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete the document "<strong>{document.name}</strong>"?</p>
          <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
