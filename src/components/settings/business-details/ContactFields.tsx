
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { BusinessFormValues } from './types';

interface ContactFieldsProps {
  form: UseFormReturn<BusinessFormValues>;
}

export const ContactFields = ({ form }: ContactFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input placeholder="(123) 456-7890" {...field} />
            </FormControl>
            <FormDescription>
              Primary business contact number
            </FormDescription>
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
              <Input placeholder="contact@yourbusiness.com" {...field} />
            </FormControl>
            <FormDescription>
              Primary business contact email
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input placeholder="https://www.yourbusiness.com" {...field} />
            </FormControl>
            <FormDescription>
              Include https:// prefix
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="tax_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tax ID / ABN</FormLabel>
            <FormControl>
              <Input placeholder="Tax ID or ABN" {...field} />
            </FormControl>
            <FormDescription>
              Your business tax identification number
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="business_hours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Hours</FormLabel>
            <FormControl>
              <Input placeholder="Mon-Fri: 9am-5pm" {...field} />
            </FormControl>
            <FormDescription>
              Your standard operating hours
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
