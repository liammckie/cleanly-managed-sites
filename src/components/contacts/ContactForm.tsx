
import React, { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ContactRecord } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';

// Define the form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  role: z.string().min(2, { message: 'Role must be at least 2 characters' }),
  department: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  is_primary: z.boolean().default(false),
  entity_type: z.string(),
  entity_id: z.string().uuid()
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  contact?: ContactRecord;
  entityType?: string;
  entityId?: string;
  onSubmit: (data: Partial<ContactRecord>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ContactForm({
  contact,
  entityType,
  entityId,
  onSubmit,
  onCancel,
  isSubmitting = false
}: ContactFormProps) {
  // Set default values from contact or props
  const defaultValues: Partial<ContactFormValues> = {
    name: contact?.name || '',
    role: contact?.role || '',
    department: contact?.department || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    notes: contact?.notes || '',
    is_primary: contact?.is_primary || false,
    entity_type: contact?.entity_type || entityType || 'client',
    entity_id: contact?.entity_id || entityId || '',
  };

  // Initialize form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  // Handle form submission
  const handleSubmit = async (values: ContactFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      toast.error('Failed to save contact');
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email (optional)" {...field} />
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
                  <Input placeholder="Phone number (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!entityType && (
            <FormField
              control={form.control}
              name="entity_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contact type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="site">Site</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Entity ID field would usually be a lookup/search component depending on entity type */}
          {!entityId && (
            <FormField
              control={form.control}
              name="entity_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Entity ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Entity ID" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes about this contact (optional)" 
                  rows={3} 
                  {...field} 
                />
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
                  Mark this as the primary contact for the entity
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (contact ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
