import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ContactDialog } from '@/components/contacts/ContactDialog';
import { contactsApi } from '@/lib/api';
import { ContactRecord } from '@/lib/types';
import { Mail, Phone, Star, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface ClientContactsCardProps {
  clientId: string;  // Add this prop to fix the type error
}

export function ClientContactsCard({ clientId }: ClientContactsCardProps) {
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const clientContacts = await contactsApi.getContactsByEntityId(clientId, 'client');
        setContacts(clientContacts);
      } catch (err: any) {
        setError(err.message || 'Failed to load contacts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [clientId, refreshKey]);

  const handleContactSubmit = async (data: Partial<ContactRecord>): Promise<void> => {
    try {
      if (data.id) {
        await contactsApi.updateContact(data.id, data);
      } else {
        await contactsApi.createContact({ ...data, entity_id: clientId, entity_type: 'client' } as Omit<ContactRecord, 'id' | 'created_at' | 'updated_at'>);
      }
      
      toast.success('Contact saved successfully');
      refreshContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact');
      throw error;
    }
  };

  const refreshContacts = () => {
    setRefreshKey(prev => prev + 1);
  };

  const primaryContact = contacts.find(contact => contact.is_primary);
  const otherContacts = contacts.filter(contact => !contact.is_primary);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
        <CardDescription>
          Manage contacts associated with this client.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading ? (
          <p>Loading contacts...</p>
        ) : error ? (
          <p className="text-destructive">Error: {error}</p>
        ) : (
          <>
            {primaryContact && (
              <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${primaryContact.email}.png`} />
                  <AvatarFallback>{primaryContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="m-0 flex items-center">
                      {primaryContact.name}
                      <Star className="ml-2 h-4 w-4 fill-yellow-500 text-yellow-500" />
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {primaryContact.role}
                  </CardDescription>
                  <div className="text-sm text-muted-foreground">
                    {primaryContact.email && (
                      <p className="flex items-center"><Mail className="mr-2 h-4 w-4" />{primaryContact.email}</p>
                    )}
                    {primaryContact.phone && (
                      <p className="flex items-center"><Phone className="mr-2 h-4 w-4" />{primaryContact.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {otherContacts.map(contact => (
              <div key={contact.id} className="grid grid-cols-[100px_1fr] items-start gap-4">
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${contact.email}.png`} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="m-0">{contact.name}</CardTitle>
                  <CardDescription>
                    {contact.role}
                  </CardDescription>
                  <div className="text-sm text-muted-foreground">
                    {contact.email && (
                      <p className="flex items-center"><Mail className="mr-2 h-4 w-4" />{contact.email}</p>
                    )}
                    {contact.phone && (
                      <p className="flex items-center"><Phone className="mr-2 h-4 w-4" />{contact.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
      <CardFooter>
        <ContactDialog
          entityType="client"
          entityId={clientId}
          onSubmit={handleContactSubmit}
          onSuccess={refreshContacts}
          trigger={
            <Button variant="default" size="sm" className="gap-1">
              <UserPlus size={16} />
              <span>Add Contact</span>
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
