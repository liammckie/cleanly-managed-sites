
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
  isVisible?: boolean;
  onClose?: () => void;
  onAction: () => void;
  actionText?: string;
  cancelText?: string;
  children?: ReactNode;
  icon?: ReactNode;
  buttonText?: string; // Added to match usage in UserRolesList
}

export function DialogWhenEmpty({
  title,
  description,
  isVisible,
  onClose,
  onAction,
  actionText,
  buttonText, // Added to match usage
  cancelText = "Cancel",
  children,
  icon
}: DialogWhenEmptyProps) {
  // Use buttonText as fallback for actionText
  const finalActionText = actionText || buttonText || "Continue";
  
  // For inline usage without dialog
  if (icon && !isVisible) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed">
        {icon}
        <h3 className="mt-4 text-lg font-medium">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>
        <Button
          onClick={onAction}
          className="mt-4"
        >
          {finalActionText}
        </Button>
      </div>
    );
  }

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
            {finalActionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogWhenEmpty;
