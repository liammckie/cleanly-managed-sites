
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClientFormData } from './types';

interface BasicInformationProps {
  formData: ClientFormData;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function BasicInformation({ 
  formData, 
  errors, 
  handleChange 
}: BasicInformationProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Client Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter client name"
              className={errors.name ? 'border-red-500' : ''}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customId">
              Custom ID
            </Label>
            <Input
              id="customId"
              name="customId"
              value={formData.customId || ''}
              onChange={handleChange}
              placeholder="Enter custom ID (optional)"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to use system-generated ID
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact_name">
            Contact Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contact_name"
            name="contact_name"
            value={formData.contact_name}
            onChange={handleChange}
            placeholder="Enter primary contact name"
            className={errors.contact_name ? 'border-red-500' : ''}
            aria-invalid={!!errors.contact_name}
          />
          {errors.contact_name && (
            <p className="text-red-500 text-sm">{errors.contact_name}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className={errors.email ? 'border-red-500' : ''}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={errors.phone ? 'border-red-500' : ''}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
