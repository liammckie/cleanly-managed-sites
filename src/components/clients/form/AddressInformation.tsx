
import React from 'react';
import { ClientFormData } from './types';
import { FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddressInformationProps {
  formData: ClientFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors?: Record<string, string>;
}

export function AddressInformation({
  formData,
  handleChange,
  handleSelectChange,
  errors = {}
}: AddressInformationProps) {
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
      
      <div>
        <FormField>
          <FormLabel htmlFor="address">Address</FormLabel>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={hasError('address') ? 'border-red-500' : ''}
          />
          {hasError('address') && <FormMessage>{errors.address}</FormMessage>}
        </FormField>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormField>
            <FormLabel htmlFor="city">City</FormLabel>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={hasError('city') ? 'border-red-500' : ''}
            />
            {hasError('city') && <FormMessage>{errors.city}</FormMessage>}
          </FormField>
        </div>
        
        <div>
          <FormField>
            <FormLabel htmlFor="state">State</FormLabel>
            <Select
              value={formData.state}
              onValueChange={(value) => handleSelectChange('state', value)}
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
          </FormField>
        </div>
        
        <div>
          <FormField>
            <FormLabel htmlFor="postcode">Postal Code</FormLabel>
            <Input
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              className={hasError('postcode') ? 'border-red-500' : ''}
            />
            {hasError('postcode') && <FormMessage>{errors.postcode}</FormMessage>}
          </FormField>
        </div>
      </div>
    </div>
  );
}
