
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { BusinessInfoFields } from './BusinessInfoFields';
import { AddressFields } from './AddressFields';
import { ContactFields } from './ContactFields';
import { SocialMediaFields } from './SocialMediaFields';
import { FormSubmitButton } from './FormSubmitButton';
import { BusinessFormValues } from './types';

interface BusinessDetailsFormContentProps {
  form: UseFormReturn<BusinessFormValues>;
  onSubmit: (data: BusinessFormValues) => Promise<void>;
  isUploading: boolean;
}

export const BusinessDetailsFormContent = ({ 
  form, 
  onSubmit, 
  isUploading 
}: BusinessDetailsFormContentProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BusinessInfoFields form={form} />
        
        <Separator className="my-4" />
        
        <AddressFields form={form} />
        
        <Separator className="my-4" />
        
        <ContactFields form={form} />
        
        <Separator className="my-4" />
        
        <SocialMediaFields form={form} />
        
        <FormSubmitButton 
          isSubmitting={form.formState.isSubmitting} 
          isUploading={isUploading} 
        />
      </form>
    </Form>
  );
};
