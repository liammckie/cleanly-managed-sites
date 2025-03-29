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
import { Plus, Pencil, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContact, updateContact, deleteContact } from '@/lib/api/contacts';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Helmet } from 'react-helmet-async';

const contactSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  department: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

type ContactSchemaType = z.infer<typeof contactSchema>;

const Employees: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { contacts, isLoading, error } = useContacts('internal');
  const queryClient = useQueryClient();

  const form = useForm<ContactSchemaType>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      notes: "",
    },
  });

  const { mutate: createContactMutation, isLoading: isCreateLoading } = useMutation(createContact, {
    onSuccess: () => {
      toast({
        title: "Contact Created",
        description: "The contact has been successfully created.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ['contacts', 'internal'] });
      setOpen(false);
      form.reset();
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to create contact.",
        variant: "destructive",
      });
    },
  });

  const { mutate: updateContactMutation, isLoading: isUpdateLoading } = useMutation(updateContact, {
    onSuccess: () => {
      toast({
        title: "Contact Updated",
        description: "The contact has been successfully updated.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ['contacts', 'internal'] });
      setOpen(false);
      form.reset();
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update contact.",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteContactMutation, isLoading: isDeleteLoading } = useMutation(deleteContact, {
    onSuccess: () => {
      toast({
        title: "Contact Deleted",
        description: "The contact has been successfully deleted.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ['contacts', 'internal'] });
      setOpen(false);
      form.reset();
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to delete contact.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: ContactSchemaType) => {
    const contactData = {
      ...values,
      entity_type: 'internal',
    };

    if (isEditMode && selectedContact) {
      updateContactMutation({ id: selectedContact.id!, contactData });
    } else {
      createContactMutation(contactData);
    }
  };

  const handleEditContact = (contact: ContactRecord) => {
    setIsEditMode(true);
    setSelectedContact(contact);
    form.setValue("name", contact.name);
    form.setValue("email", contact.email || "");
    form.setValue("phone", contact.phone || "");
    form.setValue("role", contact.role);
    form.setValue("department", contact.department || "");
    form.setValue("notes", contact.notes || "");
    setOpen(true);
  };

  const handleDeleteContact = (contact: ContactRecord) => {
    setSelectedContact(contact);
    setOpen(true);
  };

  const handleCreateContact = () => {
    setIsEditMode(false);
    setSelectedContact(null);
    form.reset();
    setOpen(true);
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Employees | CleanMap</title>
      </Helmet>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Employees</h1>
            <p className="text-muted-foreground">Manage your internal employees</p>
          </div>
          <Button onClick={handleCreateContact}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {isLoading ? (
          <div>Loading employees...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contacts?.map((contact) => (
              <Card key={contact.id} className="bg-white shadow-sm rounded-md">
                <CardHeader>
                  <CardTitle>{contact.name}</CardTitle>
                  <CardDescription>{contact.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {contact.email}
                    <br />
                    {contact.phone}
                  </p>
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditContact(contact)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ContactDialog
          contact={selectedContact || {
            name: "",
            email: "",
            phone: "",
            role: "",
            department: "",
            notes: "",
          }}
          entityType="internal"
          onSubmit={onSubmit}
          isSubmitting={isCreateLoading || isUpdateLoading || isDeleteLoading}
          title={isEditMode ? "Edit Employee" : "Create Employee"}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </div>
    </PageLayout>
  );
};

// Fix the ContactDialog props
const ContactDialog = ({ 
  contact, 
  entityType,
  onSubmit, 
  isSubmitting,
  title,
  isOpen,
  onClose
}: {
  contact: ContactRecord;
  entityType: "internal";
  onSubmit: (contactData: Partial<ContactRecord>) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const form = useForm<ContactSchemaType>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact.name,
      email: contact.email || "",
      phone: contact.phone || "",
      role: contact.role,
      department: contact.department || "",
      notes: contact.notes || "",
    },
  });

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const submitHandler = async (values: ContactSchemaType) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {title === "Edit Employee"
              ? "Make changes to your employee here. Click save when you're done."
              : "Create a new employee here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Employee name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="mail@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Employee role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Department" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Employees;
