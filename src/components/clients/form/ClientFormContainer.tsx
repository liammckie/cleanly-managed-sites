
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicInformation } from './BasicInformation';
import { AddressInformation } from './AddressInformation';
import { AdditionalInformation } from './AdditionalInformation';
import { ClientFormActions } from './ClientFormActions';
import { ClientFormProps } from './types';
import { useClientForm } from './useClientForm';
import { toast } from 'sonner';
import { clientFormSchema } from '@/lib/validation/clientSchema';
import { FormProvider, useForm } from 'react-hook-form';

export function ClientFormContainer({ mode, client }: ClientFormProps) {
  const {
    formData,
    errors: apiErrors,
    isLoading,
    handleChange,
    handleSelectChange,
    handleStatusChange,
    handleSubmit: submitForm,
    handleCancel
  } = useClientForm(mode, client);
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Initialize form with values from formData
  const methods = useForm({
    defaultValues: formData
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset validation errors
    setValidationErrors({});
    
    // Validate with Zod
    const result = clientFormSchema.safeParse(formData);
    
    if (!result.success) {
      // Format Zod errors for field-level feedback
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach(error => {
        const path = error.path.join('.');
        formattedErrors[path] = error.message;
      });
      
      setValidationErrors(formattedErrors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    // If validation passes, proceed with form submission
    submitForm(e);
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="animate-fade-in">
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>{mode === 'create' ? 'Create New Client' : 'Edit Client'}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <BasicInformation 
              formData={formData} 
              errors={{...apiErrors, ...validationErrors}} 
              handleChange={handleChange} 
            />
            
            <AddressInformation 
              handleSelectChange={handleSelectChange}
              errors={{...apiErrors, ...validationErrors}} 
            />
            
            <AdditionalInformation 
              handleStatusChange={handleStatusChange} 
              errors={{...apiErrors, ...validationErrors}}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between pt-4 border-t">
            <ClientFormActions 
              mode={mode} 
              isLoading={isLoading} 
              onCancel={handleCancel} 
            />
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
