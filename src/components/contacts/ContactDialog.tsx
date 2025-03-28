
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ContactForm } from '@/components/contacts/ContactForm';
import { ContactRecord } from '@/lib/types';
import { EntityType } from './contactSchema';

export interface ContactDialogProps {
  entityType: EntityType;
  entityId: string;
  initialContact?: Partial<ContactRecord>;
  onSubmit?: (data: Partial<ContactRecord>) => Promise<void>;
  onSuccess?: () => void;
  trigger: React.ReactNode;
  title?: string;
  disabled?: boolean;
}

export function ContactDialog({ 
  entityType, 
  entityId, 
  initialContact,
  onSubmit,
  onSuccess,
  trigger,
  title = 'Add Contact',
  disabled = false
}: ContactDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: Partial<ContactRecord>) => {
    if (!onSubmit) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        entity_id: entityId,
        entity_type: entityType
      });
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div onClick={() => !disabled && setIsOpen(true)}>
        {trigger}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <ContactForm
            entityType={entityType}
            entityId={entityId}
            initialData={initialContact}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
