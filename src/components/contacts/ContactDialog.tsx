
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ContactForm } from './ContactForm';
import { toast } from 'sonner';
import { ContactRecord } from '@/lib/types';
import { EntityType } from './contactSchema';

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Partial<ContactRecord>) => Promise<void>;
  initialData?: Partial<ContactRecord>;
  entityId: string;
  entityType: EntityType;
  title?: string;
}

export function ContactDialog({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  entityId,
  entityType,
  title = 'Add Contact'
}: ContactDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEntityType, setCurrentEntityType] = useState<EntityType>(entityType);

  const handleEntityTypeChange = (newType: EntityType) => {
    setCurrentEntityType(newType);
  };

  const handleSubmit = async (values: Partial<ContactRecord>) => {
    try {
      setIsSubmitting(true);
      
      // Ensure entity type and ID are included
      const contactData = {
        ...values,
        entity_id: entityId,
        entity_type: currentEntityType
      };
      
      await onSave(contactData);
      toast.success('Contact saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const enhancedInitialData = {
    ...initialData,
    entity_id: entityId,
    entity_type: currentEntityType
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <ContactForm
          initialData={enhancedInitialData}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ContactDialog;
