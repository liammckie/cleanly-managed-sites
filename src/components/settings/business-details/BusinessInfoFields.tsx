
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { BusinessFormValues } from './types';

interface BusinessInfoFieldsProps {
  form: UseFormReturn<BusinessFormValues>;
}

export const BusinessInfoFields = ({ form }: BusinessInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name *</FormLabel>
            <FormControl>
              <Input placeholder="Your Business Name" {...field} />
            </FormControl>
            <FormDescription>
              The official registered name of your business
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Description</FormLabel>
            <FormControl>
              <Input placeholder="Brief description of your business" {...field} />
            </FormControl>
            <FormDescription>
              A short description of your business services
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry</FormLabel>
            <FormControl>
              <Input placeholder="Your industry" {...field} />
            </FormControl>
            <FormDescription>
              The primary industry your business operates in
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
