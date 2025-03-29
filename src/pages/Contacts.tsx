import React, { useState } from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { useContacts } from '@/hooks/useContacts';
import { ContactRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

const Contacts: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { contacts, isLoading, error, createContact, updateContact, deleteContact } = useContacts('client');
  const { toast } = useToast();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedContact(null);
    setIsEditMode(false);
  };

  const handleAddContact = () => {
    setSelectedContact({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      notes: '',
      entity_id: '',
      entity_type: 'client',
    });
    setIsEditMode(false);
    handleOpen();
  };

  const handleEditContact = (contact: ContactRecord) => {
    setSelectedContact(contact);
    setIsEditMode(true);
    handleOpen();
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      toast({
        title: "Contact Deleted",
        description: "The contact has been successfully deleted.",
        variant: "success" as any,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the contact.",
        variant: "destructive" as any,
      });
    }
  };

  const handleSubmit = async (contactData: Partial<ContactRecord>) => {
    try {
      if (isEditMode && selectedContact) {
        await updateContact(selectedContact.id!, contactData);
        toast({
          title: "Contact Updated",
          description: "The contact has been successfully updated.",
          variant: "success" as any,
        });
      } else {
        await createContact(contactData as ContactRecord);
        toast({
          title: "Contact Added",
          description: "The contact has been successfully added.",
          variant: "success" as any,
        });
      }
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the contact.",
        variant: "destructive" as any,
      });
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex-1 overflow-y-auto p-6">
          <p>Loading contacts...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex-1 overflow-y-auto p-6">
          <p>Error: {error.message}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Helmet>
        <title>Contacts | CleanMap</title>
      </Helmet>
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Contacts</h2>
            <p className="text-muted-foreground">
              Manage your contacts and their information
            </p>
          </div>
          <Button onClick={handleAddContact}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Contacts</CardTitle>
            <CardDescription>
              A comprehensive list of all contacts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contacts && contacts.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="bg-secondary">
                    <CardHeader>
                      <CardTitle>{contact.name}</CardTitle>
                      <CardDescription>{contact.role}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Email: {contact.email}</p>
                      <p>Phone: {contact.phone}</p>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditContact(contact)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteContact(contact.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No contacts found.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <ContactDialog
        contact={selectedContact || {
          name: '',
          email: '',
          phone: '',
          role: '',
          department: '',
          notes: '',
          entity_id: '',
          entity_type: 'client',
        }}
        onSubmit={handleSubmit}
        isSubmitting={false}
        title={isEditMode ? "Edit Contact" : "Add Contact"}
        isOpen={open}
        onClose={handleClose}
      />
    </PageLayout>
  );
};

// Fix the ContactDialog props
const ContactDialog = ({ 
  contact, 
  onSubmit, 
  isSubmitting,
  title,
  isOpen,
  onClose
}: {
  contact: ContactRecord;
  onSubmit: (contactData: Partial<ContactRecord>) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState(contact.name || '');
  const [email, setEmail] = useState(contact.email || '');
  const [phone, setPhone] = useState(contact.phone || '');
  const [role, setRole] = useState(contact.role || '');
  const [department, setDepartment] = useState(contact.department || '');
  const [notes, setNotes] = useState(contact.notes || '');

  const handleSubmit = async () => {
    const contactData: Partial<ContactRecord> = {
      name,
      email,
      phone,
      role,
      department,
      notes,
    };
    await onSubmit(contactData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Make changes to the contact here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <Separator />
        <div className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="mr-2" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Contacts;
