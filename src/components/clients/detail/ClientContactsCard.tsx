
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { ContactsList } from './contacts/ContactsList';
import { AddContactButton } from './contacts/AddContactButton';
import { useClientContacts } from './contacts/useClientContacts';

export interface ClientContactsCardProps {
  clientId: string;
}

export function ClientContactsCard({ clientId }: ClientContactsCardProps) {
  const { contacts, isLoading, error, handleContactSubmit, refreshContacts } = useClientContacts(clientId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
        <CardDescription>
          Manage contacts associated with this client.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ContactsList 
          contacts={contacts}
          isLoading={isLoading}
          error={error}
        />
      </CardContent>
      <CardFooter>
        <AddContactButton 
          entityId={clientId}
          onSubmit={handleContactSubmit}
          onSuccess={refreshContacts}
        />
      </CardFooter>
    </Card>
  );
}
