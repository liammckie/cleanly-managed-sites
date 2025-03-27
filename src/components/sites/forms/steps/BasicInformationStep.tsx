import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { SiteFormData } from '../types/siteFormData';
import { siteStatusOptions } from '../types/siteFormData';
import { ClientSelector } from '@/components/clients/ClientSelector';

interface BasicInformationStepProps {
  formData?: SiteFormData;
  handleChange?: (field: keyof SiteFormData, value: any) => void;
  handleClientChange?: (clientId: string) => void;
  errors?: Record<string, string>;
}

export function BasicInformationStep({
  formData = {} as SiteFormData,
  handleChange = () => {},
  handleClientChange = () => {},
  errors = {}
}: BasicInformationStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter site name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client">Client <span className="text-destructive">*</span></Label>
              <ClientSelector
                selectedClientId={formData.client_id || ''}
                onClientSelect={handleClientChange}
                error={errors.client_id}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
              <Select
                value={formData.status || 'active'}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status" className={errors.status ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {siteStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customId">Custom ID</Label>
              <Input
                id="customId"
                value={formData.customId || ''}
                onChange={(e) => handleChange('customId', e.target.value)}
                placeholder="Enter custom ID (optional)"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Site Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter street address"
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Enter city"
                className={errors.city ? 'border-destructive' : ''}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
              <Input
                id="state"
                value={formData.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="Enter state"
                className={errors.state ? 'border-destructive' : ''}
              />
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code <span className="text-destructive">*</span></Label>
              <Input
                id="postalCode"
                value={formData.postalCode || ''}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                placeholder="Enter postal code"
                className={errors.postalCode ? 'border-destructive' : ''}
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive">{errors.postalCode}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country || 'Australia'}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="Enter country"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter email address"
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="representative">Site Representative</Label>
              <Input
                id="representative"
                value={formData.representative || ''}
                onChange={(e) => handleChange('representative', e.target.value)}
                placeholder="Enter site representative name"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
