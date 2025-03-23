
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ContactRecord } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  department: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  is_primary: z.boolean().optional(),
  entity_type: z.union([
    z.literal('client'),
    z.literal('site'),
    z.literal('supplier'),
    z.literal('internal')
  ]).optional(),
  entity_id: z.string().optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  contact?: ContactRecord;
  entityType?: string;
  entityId?: string;
  onSubmit: (data: Partial<ContactRecord>) => void;
  onCancel?: () => void;
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
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: contact?.name || '',
      role: contact?.role || '',
      department: contact?.department || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      notes: contact?.notes || '',
      is_primary: contact?.is_primary || false,
      entity_type: (contact?.entity_type as 'client' | 'site' | 'supplier' | 'internal') || 
                  (entityType as 'client' | 'site' | 'supplier' | 'internal') || 
                  'client',
      entity_id: contact?.entity_id || entityId || '',
    },
  });

  const handleSubmit = (data: ContactFormValues) => {
    const contactData: Partial<ContactRecord> = {
      ...data,
      entity_type: data.entity_type as 'client' | 'site' | 'supplier' | 'internal',
    };
    onSubmit(contactData);
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
                  <Input placeholder="John Doe" {...field} />
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
                  <Input placeholder="Facility Manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="Maintenance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!entityType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="entity_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Type</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value as 'client' | 'site' | 'supplier' | 'internal')}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contact type" />
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

            <FormField
              control={form.control}
              name="entity_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Entity ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional information about this contact" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_primary"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Primary Contact</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Set this as the primary contact for this entity
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (contact ? 'Update Contact' : 'Add Contact')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
