
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { ContactManagementTabs } from '@/components/contacts/ContactManagementTabs';
import { useContacts } from '@/hooks/useContacts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ContactRecord } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/auth';
import { ContactDialog } from '@/components/contacts/ContactDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { DotsHorizontalIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Contacts = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    contacts, 
    isLoading, 
    filter, 
    setFilter, 
    createContact, 
    updateContact,
    deleteContact,
    setPrimaryContact,
    isCreating,
    isUpdating,
    isDeleting
  } = useContacts();
  const [contactToDelete, setContactToDelete] = useState<ContactRecord | null>(null);

  // Handle tab change from ContactManagementTabs
  const handleTabChange = (value: string) => {
    let contactType = 'all';
    
    switch (value) {
      case 'client':
        contactType = 'client';
        break;
      case 'site':
        contactType = 'site';
        break;
      case 'supplier':
        contactType = 'supplier';
        break;
      case 'internal':
        contactType = 'internal';
        break;
      default:
        contactType = 'all';
        break;
    }
    
    setFilter(contactType);
  };
  
  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      (contact.email && contact.email.toLowerCase().includes(query)) ||
      (contact.phone && contact.phone.toLowerCase().includes(query)) ||
      (contact.role && contact.role.toLowerCase().includes(query)) ||
      (contact.department && contact.department.toLowerCase().includes(query))
    );
  });

  // Handle deleting a contact
  const handleDeleteContact = () => {
    if (contactToDelete) {
      deleteContact(contactToDelete.id);
      setContactToDelete(null);
    }
  };

  // Handle setting a contact as primary
  const handleSetPrimary = (contact: ContactRecord) => {
    setPrimaryContact({
      id: contact.id,
      entityId: contact.entity_id,
      entityType: contact.entity_type
    });
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto py-6">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 space-y-2 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
                <ContactDialog 
                  onSubmit={createContact}
                  isSubmitting={isCreating}
                />
              </div>
              
              <div className="mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search contacts..."
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <ContactManagementTabs onValueChange={handleTabChange} />
              
              <div className="mt-6 grid grid-cols-1 gap-6">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <Skeleton className="h-6 w-1/2" />
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Skeleton className="h-4 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-4 w-1/4" />
                      </CardContent>
                    </Card>
                  ))
                ) : filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <ContactCard 
                      key={contact.id} 
                      contact={contact} 
                      onSetPrimary={handleSetPrimary}
                      onUpdate={(data) => updateContact({ id: contact.id, data })}
                      onDelete={() => setContactToDelete(contact)}
                      isUpdating={isUpdating}
                    />
                  ))
                ) : (
                  <Card className="col-span-full p-8 text-center">
                    <p className="text-muted-foreground">No contacts found. Add a contact to get started.</p>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!contactToDelete} 
        onOpenChange={(open) => !open && setContactToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the contact{contactToDelete ? ` "${contactToDelete.name}"` : ''}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContact} className="bg-destructive text-destructive-foreground">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

interface ContactCardProps {
  contact: ContactRecord;
  onSetPrimary: (contact: ContactRecord) => void;
  onUpdate: (data: Partial<ContactRecord>) => void;
  onDelete: () => void;
  isUpdating: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  contact, 
  onSetPrimary, 
  onUpdate,
  onDelete,
  isUpdating
}) => {
  return (
    <Card>
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-xl font-semibold">{contact.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{contact.role}</p>
        </div>
        <div className="flex items-center gap-2">
          {contact.is_primary && (
            <Badge variant="secondary">Primary Contact</Badge>
          )}
          <Badge>{contact.entity_type}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ContactDialog 
                contact={contact}
                onSubmit={onUpdate}
                isSubmitting={isUpdating}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                }
              />
              {!contact.is_primary && (
                <DropdownMenuItem onClick={() => onSetPrimary(contact)}>
                  <Badge className="mr-2">P</Badge>
                  Set as Primary
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-1">
          {contact.department && (
            <p className="text-sm"><span className="font-medium">Department:</span> {contact.department}</p>
          )}
          {contact.email && (
            <p className="text-sm"><span className="font-medium">Email:</span> {contact.email}</p>
          )}
          {contact.phone && (
            <p className="text-sm"><span className="font-medium">Phone:</span> {contact.phone}</p>
          )}
          {contact.notes && (
            <p className="text-sm"><span className="font-medium">Notes:</span> {contact.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Contacts;
