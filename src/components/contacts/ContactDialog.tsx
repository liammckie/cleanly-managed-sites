
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ContactRecord } from '@/lib/types';
import { ContactForm } from './ContactForm';
import { EmployeeContactForm } from './EmployeeContactForm';

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
  const [selectedEntityType, setSelectedEntityType] = useState<'site' | 'client' | 'supplier' | 'internal'>(
    entityType || (contact?.entity_type as any) || 'client'
  );

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  useEffect(() => {
    setIsSubmittingLocal(isSubmitting);
  }, [isSubmitting]);

  useEffect(() => {
    if (entityType) {
      setSelectedEntityType(entityType);
    } else if (contact?.entity_type) {
      setSelectedEntityType(contact.entity_type as any);
    }
  }, [entityType, contact]);

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

  const handleEntityTypeChange = (newType: 'site' | 'client' | 'supplier' | 'internal') => {
    setSelectedEntityType(newType);
  };

  const renderForm = () => {
    // Use the employee form for internal contacts
    if (selectedEntityType === 'internal') {
      return (
        <EmployeeContactForm
          contact={contact}
          onSubmit={handleSubmit}
          onCancel={() => handleOpenChange(false)}
          isSubmitting={isSubmittingLocal}
        />
      );
    }

    // Use the regular contact form for other contact types
    return (
      <ContactForm
        contact={contact}
        entityType={entityType}
        entityId={entityId}
        onSubmit={handleSubmit}
        onCancel={() => handleOpenChange(false)}
        isSubmitting={isSubmittingLocal}
        onEntityTypeChange={handleEntityTypeChange}
      />
    );
  };

  const renderContent = () => (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>
          {contact 
            ? `Edit ${selectedEntityType === 'internal' ? 'Employee' : title}` 
            : `Add ${selectedEntityType === 'internal' ? 'Employee' : title}`}
        </DialogTitle>
        <DialogDescription>
          {selectedEntityType === 'internal' 
            ? 'Manage employee information including roles, departments, and employment details.' 
            : `${contact ? 'Edit' : 'Enter'} ${title.toLowerCase()} details below`}
        </DialogDescription>
      </DialogHeader>
      
      {renderForm()}
    </DialogContent>
  );

  if (trigger) {
    return (
      <>
        <div onClick={() => handleOpenChange(true)}>{trigger}</div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          {renderContent()}
        </Dialog>
      </>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {renderContent()}
    </Dialog>
  );
}
