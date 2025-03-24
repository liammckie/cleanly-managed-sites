
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck } from 'lucide-react';

interface EmptyContactsStateProps {
  addContact: () => void;
  addExistingContact?: (contactId: string) => void;
}

export function EmptyContactsState({ addContact, addExistingContact }: EmptyContactsStateProps) {
  return (
    <div className="text-center p-8 border border-dashed rounded-md bg-gray-50">
      <p className="text-gray-500 mb-4">
        No contacts added yet. <span className="text-destructive font-medium">At least one contact is required.</span>
      </p>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        <Button
          type="button"
          onClick={addContact}
          variant="outline"
          className="flex items-center gap-1"
        >
          <UserPlus className="h-4 w-4" />
          Add New Contact
        </Button>
        
        {addExistingContact && (
          <Button
            type="button"
            variant="secondary"
            className="flex items-center gap-1"
            onClick={() => document.querySelector('[role="combobox"]')?.dispatchEvent(new MouseEvent('click'))}
          >
            <UserCheck className="h-4 w-4" />
            Select Existing Contact
          </Button>
        )}
      </div>
    </div>
  );
}
