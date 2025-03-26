
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteUserModalProps {
  isOpen: boolean;
  userName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteUserModal({
  isOpen,
  userName,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteUserModalProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm User Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the user <span className="font-medium">{userName}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <Button 
            onClick={onConfirm} 
            variant="destructive" 
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
