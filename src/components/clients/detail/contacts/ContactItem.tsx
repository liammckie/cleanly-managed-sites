
import React from 'react';
import { ContactRecord } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Star } from 'lucide-react';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface ContactItemProps {
  contact: ContactRecord;
  isPrimary: boolean;
}

export function ContactItem({ contact, isPrimary }: ContactItemProps) {
  return (
    <div className="grid grid-cols-[100px_1fr] items-start gap-4">
      <Avatar>
        <AvatarImage src={`https://avatar.vercel.sh/${contact.email}.png`} />
        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <CardTitle className="m-0 flex items-center">
            {contact.name}
            {isPrimary && <Star className="ml-2 h-4 w-4 fill-yellow-500 text-yellow-500" />}
          </CardTitle>
        </div>
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
  );
}
