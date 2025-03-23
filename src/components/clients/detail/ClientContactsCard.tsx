
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, UserPlus, Pencil, Trash2 } from 'lucide-react';
import { useClientContacts } from '@/hooks/useClientContacts';
import { ContactRecord } from '@/lib/types';
import { ContactDialog } from '@/components/contacts/ContactDialog';

export function ClientContactsCard({ clientId }: { clientId: string }) {
  const {
    contacts,
    isLoading,
    isError,
    addContact,
    updateContact,
    deleteContact,
    setPrimaryContact,
    isAdding,
    isUpdating,
    isDeleting,
  } = useClientContacts(clientId);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactRecord | null>(null);
  
  const handleAddContact = () => {
    setEditingContact(null);
    setIsDialogOpen(true);
  };
  
  const handleEditContact = (contact: ContactRecord) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };
  
  const handleDeleteContact = (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contactId);
    }
  };
  
  const handleSaveContact = (contactData: Partial<ContactRecord>) => {
    if (editingContact) {
      updateContact({ id: editingContact.id, contactData });
    } else {
      addContact(contactData);
    }
    setIsDialogOpen(false);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <p>Loading contacts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error loading contacts</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Contacts</span>
          <Button 
            size="sm" 
            onClick={handleAddContact} 
            disabled={isAdding}
            className="flex items-center gap-1"
          >
            <UserPlus className="h-4 w-4" />
            Add Contact
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div 
                key={contact.id} 
                className="p-4 border rounded-md flex flex-col md:flex-row justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium">{contact.name}</h3>
                    {contact.is_primary && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        Primary
                      </Badge>
                    )}
                    {contact.role && (
                      <Badge variant="outline" className="text-xs">
                        {contact.role}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {contact.email && (
                      <p>Email: <a href={`mailto:${contact.email}`} className="text-primary">{contact.email}</a></p>
                    )}
                    {contact.phone && (
                      <p>Phone: <a href={`tel:${contact.phone}`} className="text-primary">{contact.phone}</a></p>
                    )}
                    {contact.department && <p>Department: {contact.department}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  {!contact.is_primary && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setPrimaryContact(contact.id)}
                      disabled={isUpdating}
                      className="text-xs"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Make Primary
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditContact(contact)}
                    disabled={isUpdating}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteContact(contact.id)}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 border border-dashed rounded-md bg-muted/50">
            <p className="text-muted-foreground mb-4">No contacts added yet.</p>
            <Button 
              variant="outline" 
              onClick={handleAddContact}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              Add First Contact
            </Button>
          </div>
        )}
      </CardContent>
      
      <ContactDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        contact={editingContact}
        onSave={handleSaveContact}
        entityType="client"
      />
    </Card>
  );
}
