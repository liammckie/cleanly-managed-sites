
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
import { toast } from 'sonner';

interface ContactDialogProps {
  contact?: ContactRecord;
  entityType?: string;
  entityId?: string;
  onSubmit: (data: Partial<ContactRecord>) => void;
  isSubmitting?: boolean;
  trigger?: React.ReactNode;
  title?: string;
  onSuccess?: () => void;
}

export function ContactDialog({
  contact,
  entityType,
  entityId,
  onSubmit,
  isSubmitting = false,
  trigger,
  title,
  onSuccess
}: ContactDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: Partial<ContactRecord>) => {
    try {
      // Ensure services is properly formatted as an array
      if (data.services && !Array.isArray(data.services)) {
        data.services = [data.services as unknown as string];
      }
      
      // Automatically set entity_type and entity_id if provided as props
      if (entityType && !data.entity_type) {
        data.entity_type = entityType as 'site' | 'client' | 'supplier' | 'internal';
      }
      
      if (entityId && !data.entity_id) {
        data.entity_id = entityId;
      }
      
      await onSubmit(data);
      setOpen(false);
      
      // Notify success
      toast.success(contact ? 'Contact updated successfully' : 'Contact added successfully');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting contact:", error);
      toast.error(`Failed to ${contact ? 'update' : 'add'} contact`);
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
