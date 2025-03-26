
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface DeleteUserModalProps {
  isOpen: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void; // Added for backward compatibility
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  userName,
  onConfirm,
  onCancel,
  onClose
}) => {
  const handleClose = () => {
    // Call both handlers for backward compatibility
    if (onClose) onClose();
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm User Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete user {userName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
