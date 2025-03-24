
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { ContactDialog } from '@/components/contacts/ContactDialog';
import { ContactRecord } from '@/lib/types';

interface AddContactButtonProps {
  entityId: string;
  onSubmit: (data: Partial<ContactRecord>) => Promise<void>;
  onSuccess: () => void;
}

export function AddContactButton({ entityId, onSubmit, onSuccess }: AddContactButtonProps) {
  return (
    <ContactDialog
      entityType="client"
      entityId={entityId}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
      trigger={
        <Button variant="default" size="sm" className="gap-1">
          <UserPlus size={16} />
          <span>Add Contact</span>
        </Button>
      }
    />
  );
}
