
import React from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { contactFormSchema } from '@/lib/validation/contactSchema';
import { FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export interface ContactFormProps {
  initialData: {
    id?: string;
    name?: string;
    role?: string;
    department?: string;
    email?: string;
    phone?: string;
    notes?: string;
    is_primary?: boolean;
    entity_type?: string;
    entity_id?: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ContactForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}: ContactFormProps) {
  const methods = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: initialData.name || '',
      role: initialData.role || '',
      department: initialData.department || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      notes: initialData.notes || '',
      is_primary: initialData.is_primary || false,
    }
  });
  
  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit({
      ...initialData,
      ...data
    });
  });
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Controller
          control={methods.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                {...field}
                className={fieldState.error ? 'border-red-500' : ''}
              />
              {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
            </FormItem>
          )}
        />
        
        <Controller
          control={methods.control}
          name="role"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="role">Role</FormLabel>
              <Input
                id="role"
                {...field}
                className={fieldState.error ? 'border-red-500' : ''}
              />
              {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
            </FormItem>
          )}
        />
        
        <Controller
          control={methods.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="department">Department</FormLabel>
              <Input
                id="department"
                {...field}
              />
            </FormItem>
          )}
        />
        
        <Controller
          control={methods.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                {...field}
                className={fieldState.error ? 'border-red-500' : ''}
              />
              {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
            </FormItem>
          )}
        />
        
        <Controller
          control={methods.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <Input
                id="phone"
                {...field}
              />
            </FormItem>
          )}
        />
        
        <Controller
          control={methods.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="notes">Notes</FormLabel>
              <Textarea
                id="notes"
                {...field}
              />
            </FormItem>
          )}
        />
        
        <Controller
          control={methods.control}
          name="is_primary"
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_primary"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label htmlFor="is_primary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Primary Contact
              </label>
            </div>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Contact'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
