
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiteFormData } from '../siteFormTypes';
import { SiteStatus } from '../../SiteCard';

interface BasicInformationStepProps {
  formData: SiteFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (value: SiteStatus) => void;
}

export function BasicInformationStep({ 
  formData, 
  handleChange, 
  handleStatusChange 
}: BasicInformationStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Site Name <span className="text-destructive">*</span></Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter site name"
            value={formData.name}
            onChange={handleChange}
            className="glass-input"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
          <Input
            id="address"
            name="address"
            placeholder="Enter street address"
            value={formData.address}
            onChange={handleChange}
            className="glass-input"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
            <Input
              id="city"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              className="glass-input"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
            <Select 
              value={formData.state} 
              onValueChange={(value) => handleChange({ target: { name: 'state', value } } as any)}
            >
              <SelectTrigger id="state" className="glass-input">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="NSW">New South Wales</SelectItem>
                <SelectItem value="VIC">Victoria</SelectItem>
                <SelectItem value="QLD">Queensland</SelectItem>
                <SelectItem value="WA">Western Australia</SelectItem>
                <SelectItem value="SA">South Australia</SelectItem>
                <SelectItem value="TAS">Tasmania</SelectItem>
                <SelectItem value="ACT">Australian Capital Territory</SelectItem>
                <SelectItem value="NT">Northern Territory</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode <span className="text-destructive">*</span></Label>
            <Input
              id="postcode"
              name="postcode"
              placeholder="Enter postcode"
              value={formData.postcode}
              onChange={handleChange}
              className="glass-input"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
            <Select 
              value={formData.status} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status" className="glass-input">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Contact Information</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="representative">Representative Name <span className="text-destructive">*</span></Label>
            <Input
              id="representative"
              name="representative"
              placeholder="Enter representative name"
              value={formData.representative}
              onChange={handleChange}
              className="glass-input"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className="glass-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
