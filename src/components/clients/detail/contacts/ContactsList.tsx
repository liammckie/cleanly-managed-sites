
import React from 'react';
import { ContactRecord } from '@/lib/types';
import { ContactItem } from './ContactItem';

interface ContactsListProps {
  contacts: ContactRecord[];
  isLoading: boolean;
  error: string | null;
}

export function ContactsList({ contacts, isLoading, error }: ContactsListProps) {
  if (isLoading) {
    return <p>Loading contacts...</p>;
  }
  
  if (error) {
    return <p className="text-destructive">Error: {error}</p>;
  }
  
  if (!contacts || contacts.length === 0) {
    return <p className="text-muted-foreground">No contacts found.</p>;
  }
  
  const primaryContact = contacts.find(contact => contact.is_primary);
  const otherContacts = contacts.filter(contact => !contact.is_primary);
  
  return (
    <div className="space-y-4">
      {primaryContact && (
        <ContactItem 
          contact={primaryContact} 
          isPrimary={true}
        />
      )}
      
      {otherContacts.map(contact => (
        <ContactItem 
          key={contact.id} 
          contact={contact} 
          isPrimary={false}
        />
      ))}
    </div>
  );
}
