
import React from 'react';
import { ClientFormData } from './types';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useFormContext } from 'react-hook-form';

interface AddressInformationProps {
  errors?: Record<string, string>;
  handleSelectChange: (name: string, value: string) => void;
}

export function AddressInformation({
  errors = {},
  handleSelectChange
}: AddressInformationProps) {
  const { control } = useFormContext<ClientFormData>();
  
  const stateOptions = [
    { value: 'NSW', label: 'New South Wales' },
    { value: 'VIC', label: 'Victoria' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'WA', label: 'Western Australia' },
    { value: 'SA', label: 'South Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'ACT', label: 'Australian Capital Territory' },
    { value: 'NT', label: 'Northern Territory' }
  ];
  
  const hasError = (field: string) => Boolean(errors[field]);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Address Information</h3>
      
      <Controller
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="address">Address</FormLabel>
            <Input
              id="address"
              {...field}
              className={hasError('address') ? 'border-red-500' : ''}
            />
            {hasError('address') && <FormMessage>{errors.address}</FormMessage>}
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="city">City</FormLabel>
              <Input
                id="city"
                {...field}
                className={hasError('city') ? 'border-red-500' : ''}
              />
              {hasError('city') && <FormMessage>{errors.city}</FormMessage>}
            </FormItem>
          )}
        />
        
        <Controller
          control={control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="state">State</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleSelectChange('state', value);
                }}
              >
                <SelectTrigger className={hasError('state') ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError('state') && <FormMessage>{errors.state}</FormMessage>}
            </FormItem>
          )}
        />
        
        <Controller
          control={control}
          name="postcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="postcode">Postal Code</FormLabel>
              <Input
                id="postcode"
                {...field}
                className={hasError('postcode') ? 'border-red-500' : ''}
              />
              {hasError('postcode') && <FormMessage>{errors.postcode}</FormMessage>}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
