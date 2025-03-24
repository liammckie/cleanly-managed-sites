
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ContactRecord } from '@/lib/types';
import { ContactForm } from './ContactForm';

export interface ContactDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contact?: ContactRecord;
  entityType?: 'site' | 'client' | 'supplier' | 'internal';
  entityId?: string;
  isSubmitting?: boolean;
  title?: string;
  onSubmit: (contactData: Partial<ContactRecord>) => Promise<void | boolean>;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ContactDialog({
  open,
  onOpenChange,
  contact,
  entityType,
  entityId,
  isSubmitting = false,
  title = 'Contact',
  onSubmit,
  trigger,
  onSuccess,
}: ContactDialogProps) {
  const [isOpen, setIsOpen] = useState(open || false);
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(isSubmitting);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  useEffect(() => {
    setIsSubmittingLocal(isSubmitting);
  }, [isSubmitting]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const handleSubmit = async (values: Partial<ContactRecord>) => {
    try {
      setIsSubmittingLocal(true);
      const result = await onSubmit(values);
      // If onSubmit returns true or void (undefined), consider it successful
      if (result !== false) {
        handleOpenChange(false);
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setIsSubmittingLocal(false);
    }
  };

  if (trigger) {
    return (
      <>
        <div onClick={() => handleOpenChange(true)}>{trigger}</div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{contact ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
              <DialogDescription>
                {contact ? `Edit ${title.toLowerCase()} details below` : `Enter ${title.toLowerCase()} details below`}
              </DialogDescription>
            </DialogHeader>
            
            <ContactForm
              contact={contact}
              entityType={entityType}
              entityId={entityId}
              onSubmit={handleSubmit}
              onCancel={() => handleOpenChange(false)}
              isSubmitting={isSubmittingLocal}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{contact ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
          <DialogDescription>
            {contact ? `Edit ${title.toLowerCase()} details below` : `Enter ${title.toLowerCase()} details below`}
          </DialogDescription>
        </DialogHeader>
        
        <ContactForm
          contact={contact}
          entityType={entityType}
          entityId={entityId}
          onSubmit={handleSubmit}
          onCancel={() => handleOpenChange(false)}
          isSubmitting={isSubmittingLocal}
        />
      </DialogContent>
    </Dialog>
  );
}
