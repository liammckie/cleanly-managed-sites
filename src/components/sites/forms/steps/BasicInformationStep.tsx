
import React from 'react';
import { useForm, Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteStatus } from '@/types/common';

// Define the prop interface
export interface BasicInformationStepProps {
  formData: SiteFormData;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (status: SiteStatus) => void;
  handleClientChange: (clientId: string) => void;
  setFormData: (data: SiteFormData) => void;
}

// StatusSelectorProps
export interface StatusSelectorProps {
  value: SiteStatus;
  onChange: (status: SiteStatus) => void;
  options: SiteStatus[];
  name: string;
  label: string;
  control: Control<any>;
}

export const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
  formData,
  errors,
  handleChange,
  handleStatusChange,
  handleClientChange,
  setFormData
}) => {
  const form = useForm({
    defaultValues: formData
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Site Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter site name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        
        {/* Status Selector */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={(e) => handleStatusChange(e.target.value as SiteStatus)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="on-hold">On Hold</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Client Selector */}
      <div className="space-y-2">
        <Label htmlFor="client_id">Client</Label>
        <select
          id="client_id"
          name="client_id"
          value={formData.client_id || ''}
          onChange={(e) => handleClientChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="">Select a client</option>
          {/* Client options would be populated here */}
        </select>
        {errors.client_id && <p className="text-red-500 text-sm">{errors.client_id}</p>}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter street address"
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
      </div>

      {/* City, State, Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter state"
            className={errors.state ? 'border-red-500' : ''}
          />
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Enter postal code"
            className={errors.postalCode ? 'border-red-500' : ''}
          />
          {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
        </div>
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Enter country"
          defaultValue="Australia"
          className={errors.country ? 'border-red-500' : ''}
        />
        {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="Enter email address"
            type="email"
          />
        </div>
      </div>

      {/* Representative */}
      <div className="space-y-2">
        <Label htmlFor="representative">Site Representative</Label>
        <Input
          id="representative"
          name="representative"
          value={formData.representative || ''}
          onChange={handleChange}
          placeholder="Enter site representative name"
        />
      </div>
    </div>
  );
};
