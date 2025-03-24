
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface ContactsPageHeaderProps {
  onAddContact: () => void;
}

export const ContactsPageHeader = ({ onAddContact }: ContactsPageHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground">
          Manage your business contacts
        </p>
      </div>
      <Button 
        onClick={onAddContact}
        className="flex items-center gap-1"
      >
        <UserPlus className="h-4 w-4" />
        Add New Contact
      </Button>
    </div>
  );
};
