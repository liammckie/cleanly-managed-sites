
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicInformation } from './BasicInformation';
import { AddressInformation } from './AddressInformation';
import { AdditionalInformation } from './AdditionalInformation';
import { ClientFormActions } from './ClientFormActions';
import { ClientFormProps } from './types';
import { useClientForm } from './useClientForm';

export function ClientFormContainer({ mode, client }: ClientFormProps) {
  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSelectChange,
    handleStatusChange,
    handleSubmit,
    handleCancel
  } = useClientForm(mode, client);
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create New Client' : 'Edit Client'}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <BasicInformation 
            formData={formData} 
            errors={errors} 
            handleChange={handleChange} 
          />
          
          <AddressInformation 
            formData={formData} 
            handleChange={handleChange} 
            handleSelectChange={handleSelectChange} 
          />
          
          <AdditionalInformation 
            formData={formData} 
            handleChange={handleChange} 
            handleStatusChange={handleStatusChange} 
          />
        </CardContent>
        
        <CardFooter>
          <ClientFormActions 
            mode={mode} 
            isLoading={isLoading} 
            onCancel={handleCancel} 
          />
        </CardFooter>
      </Card>
    </form>
  );
}
