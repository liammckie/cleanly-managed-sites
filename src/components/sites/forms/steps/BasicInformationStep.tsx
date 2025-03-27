
import React from 'react';
import { SiteFormData } from '../types/siteFormData';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { SiteStatus } from '@/types/common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface BasicInformationStepProps {
  formData: SiteFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClientChange: (clientId: string) => void;
  handleStatusChange: (status: SiteStatus) => void;
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>;
  errors: Record<string, string>;
}

export function BasicInformationStep({
  formData,
  handleChange,
  handleClientChange,
  handleStatusChange,
  setFormData,
  errors
}: BasicInformationStepProps) {
  const statusOptions: SiteStatus[] = ['active', 'inactive', 'pending', 'on-hold', 'lost'];

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <FormField
          name="name"
          render={() => (
            <FormItem>
              <FormLabel htmlFor="name">Site Name</FormLabel>
              <FormControl>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="Enter site name"
                  className={errors.name ? 'border-destructive' : ''}
                />
              </FormControl>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="address"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="address">Address</FormLabel>
                <FormControl>
                  <Input 
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    placeholder="Enter street address"
                    className={errors.address ? 'border-destructive' : ''}
                  />
                </FormControl>
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address}</p>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            name="city"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="city">City</FormLabel>
                <FormControl>
                  <Input 
                    id="city"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className={errors.city ? 'border-destructive' : ''}
                  />
                </FormControl>
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            name="state"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="state">State</FormLabel>
                <FormControl>
                  <Input 
                    id="state"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className={errors.state ? 'border-destructive' : ''}
                  />
                </FormControl>
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state}</p>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            name="postalCode"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="postalCode">Postal Code</FormLabel>
                <FormControl>
                  <Input 
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode || ''}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                    className={errors.postalCode ? 'border-destructive' : ''}
                  />
                </FormControl>
                {errors.postalCode && (
                  <p className="text-sm text-destructive">{errors.postalCode}</p>
                )}
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="status"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="status">Status</FormLabel>
                <Select 
                  defaultValue={formData.status || 'active'} 
                  onValueChange={(value) => handleStatusChange(value as SiteStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status}</p>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            name="client_id"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="client_id">Client</FormLabel>
                <FormControl>
                  <Input 
                    id="client_id"
                    name="client_id"
                    value={formData.client_id || ''}
                    onChange={(e) => handleClientChange(e.target.value)}
                    placeholder="Select client"
                    className={errors.client_id ? 'border-destructive' : ''}
                  />
                </FormControl>
                {errors.client_id && (
                  <p className="text-sm text-destructive">{errors.client_id}</p>
                )}
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="phone"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="phone">Phone</FormLabel>
                <FormControl>
                  <Input 
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            name="email"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input 
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
