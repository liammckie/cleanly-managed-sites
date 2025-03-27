
import React from 'react';
import { ClientFormData } from './types';
import { FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useFormContext } from 'react-hook-form';

interface AdditionalInformationProps {
  handleStatusChange: (value: string) => void;
  errors?: Record<string, string>;
}

export function AdditionalInformation({
  handleStatusChange,
  errors = {}
}: AdditionalInformationProps) {
  const { control } = useFormContext<ClientFormData>();
  
  const hasError = (field: string) => Boolean(errors[field]);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Additional Information</h3>
      
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <div>
            <FormLabel htmlFor="status">Status</FormLabel>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                handleStatusChange(value);
              }}
            >
              <SelectTrigger id="status" className={hasError('status') ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            {hasError('status') && <FormMessage>{errors.status}</FormMessage>}
          </div>
        )}
      />
      
      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <div>
            <FormLabel htmlFor="notes">Notes</FormLabel>
            <Textarea
              id="notes"
              {...field}
              rows={4}
              className={hasError('notes') ? 'border-red-500' : ''}
            />
            {hasError('notes') && <FormMessage>{errors.notes}</FormMessage>}
          </div>
        )}
      />
    </div>
  );
}
