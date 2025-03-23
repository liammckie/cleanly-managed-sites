import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ContactForm } from './ContactForm';
import { ContactRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ContactDialogProps {
  contact?: ContactRecord;
  entityType?: string;
  entityId?: string;
  onSubmit: (data: Partial<ContactRecord>) => void;
  isSubmitting?: boolean;
  trigger?: React.ReactNode;
  title?: string;
}

export function ContactDialog({
  contact,
  entityType,
  entityId,
  onSubmit,
  isSubmitting = false,
  trigger,
  title
}: ContactDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: Partial<ContactRecord>) => {
    try {
      await onSubmit(data);
      setOpen(false);
    } catch (error) {
      console.error("Error submitting contact:", error);
      // Keep dialog open if there's an error
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {title || (contact ? 'Edit Contact' : 'Add New Contact')}
          </DialogTitle>
        </DialogHeader>
        <ContactForm
          contact={contact}
          entityType={entityType}
          entityId={entityId}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
