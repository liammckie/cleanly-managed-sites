
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DialogWhenEmptyProps {
  title: string;
  description: string;
  isVisible: boolean;
  onClose: () => void;
  onAction: () => void;
  actionText: string;
  cancelText?: string;
  children?: ReactNode;
}

export function DialogWhenEmpty({
  title,
  description,
  isVisible,
  onClose,
  onAction,
  actionText,
  cancelText = "Cancel",
  children
}: DialogWhenEmptyProps) {
  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        {children && (
          <div className="py-4">
            {children}
          </div>
        )}
        
        <DialogFooter className="flex items-center justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button onClick={onAction}>
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogWhenEmpty;
