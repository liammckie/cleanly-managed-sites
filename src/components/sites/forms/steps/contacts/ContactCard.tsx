
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SiteContact } from '../../types/contactTypes';

interface ContactCardProps {
  contact: SiteContact;
  onEdit: () => void;
  onDelete: () => void;
  isPrimary?: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onEdit,
  onDelete,
  isPrimary
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{contact.name}</CardTitle>
          {isPrimary && <Badge variant="secondary">Primary Contact</Badge>}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <p className="font-medium">{contact.role}</p>
          {contact.department && <p className="text-muted-foreground">{contact.department}</p>}
          {contact.email && <p>{contact.email}</p>}
          {contact.phone && <p>{contact.phone}</p>}
          {contact.notes && <p className="text-muted-foreground mt-2">{contact.notes}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-0">
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContactCard;
