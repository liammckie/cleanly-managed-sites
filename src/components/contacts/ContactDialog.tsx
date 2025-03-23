import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ContactRecord } from '@/lib/types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  is_primary: z.boolean().default(false),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contact?: ContactRecord;
  onSave?: (contactData: Partial<ContactRecord>) => void;
  entityType: string;
  entityId: string;
  isSubmitting?: boolean;
  title?: string;
  onSubmit: (contactData: Partial<ContactRecord>) => Promise<void>;
}

export function ContactDialog({
  open,
  onOpenChange,
  contact,
  onSave,
  entityType,
  entityId,
  isSubmitting = false,
  title = 'Contact',
  onSubmit,
}: ContactDialogProps) {
  const [isOpen, setIsOpen] = useState(open || false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name || '',
      role: contact?.role || '',
      department: contact?.department || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      notes: contact?.notes || '',
      is_primary: contact?.is_primary || false,
    },
  });

  // Update form values when contact changes
  useEffect(() => {
    if (contact) {
      form.reset({
        name: contact.name || '',
        role: contact.role || '',
        department: contact.department || '',
        email: contact.email || '',
        phone: contact.phone || '',
        notes: contact.notes || '',
        is_primary: contact.is_primary || false,
      });
    } else {
      form.reset({
        name: '',
        role: '',
        department: '',
        email: '',
        phone: '',
        notes: '',
        is_primary: false,
      });
    }
  }, [contact, form]);

  // Sync internal state with external state
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const handleSubmit = async (values: ContactFormValues) => {
    try {
      await onSubmit({
        ...values,
        entity_id: entityId,
        entity_type: entityType,
      });
      
      handleOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{contact ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact name" {...field} />
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
                    <Input placeholder="Contact role" {...field} />
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
                    <Input placeholder="Department (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email address" type="email" {...field} />
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
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_primary"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Primary Contact</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Set this as the primary contact for this {entityType}
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Contact'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
