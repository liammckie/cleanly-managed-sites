import React, { useEffect } from 'react';
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
import { SiteStatus } from '@/lib/types/commonTypes';
import { FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { ClientSelect } from '../../clients/ClientSelect';
import { useClientData } from '@/hooks/useClientData';

interface BasicInformationStepProps {
  formData: SiteFormData;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (value: SiteStatus) => void;
  handleClientChange: (clientId: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>;
}

export function BasicInformationStep({ 
  formData, 
  errors,
  handleChange, 
  handleStatusChange,
  handleClientChange,
  setFormData
}: BasicInformationStepProps) {
  const clientData = useClientData(formData.clientId, formData, setFormData);

  useEffect(() => {
    if (formData.clientId && formData.clientId.trim() === '') {
      handleClientChange('');
    }
  }, [formData.clientId, handleClientChange]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <FormItem className="space-y-2">
          <Label htmlFor="client">Client <span className="text-destructive">*</span></Label>
          <ClientSelect 
            value={formData.clientId}
            onChange={(clientId) => {
              handleClientChange(clientId);
            }}
            error={errors['clientId']}
          />
          {errors['clientId'] && <FormMessage>{errors['clientId']}</FormMessage>}
        </FormItem>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem className="space-y-2">
            <Label htmlFor="name">Site Name <span className="text-destructive">*</span></Label>
            <FormControl>
              <Input
                id="name"
                name="name"
                placeholder="Enter site name"
                value={formData.name}
                onChange={handleChange}
                className={`glass-input ${errors['name'] ? 'border-destructive' : ''}`}
                required
                aria-invalid={!!errors['name']}
              />
            </FormControl>
            {errors['name'] && <FormMessage>{errors['name']}</FormMessage>}
          </FormItem>
          
          <FormItem className="space-y-2">
            <Label htmlFor="customId">Custom ID</Label>
            <FormControl>
              <Input
                id="customId"
                name="customId"
                placeholder="Enter custom ID (optional)"
                value={formData.customId || ''}
                onChange={handleChange}
                className="glass-input"
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">Leave blank to use system-generated ID</p>
          </FormItem>
        </div>
        
        <FormItem className="space-y-2">
          <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
          <FormControl>
            <Input
              id="address"
              name="address"
              placeholder="Enter street address"
              value={formData.address}
              onChange={handleChange}
              className={`glass-input ${errors['address'] ? 'border-destructive' : ''}`}
              required
              aria-invalid={!!errors['address']}
            />
          </FormControl>
          {errors['address'] && <FormMessage>{errors['address']}</FormMessage>}
        </FormItem>
        
        <div className="grid grid-cols-2 gap-4">
          <FormItem className="space-y-2">
            <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
            <FormControl>
              <Input
                id="city"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                className={`glass-input ${errors['city'] ? 'border-destructive' : ''}`}
                required
                aria-invalid={!!errors['city']}
              />
            </FormControl>
            {errors['city'] && <FormMessage>{errors['city']}</FormMessage>}
          </FormItem>
          
          <FormItem className="space-y-2">
            <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
            <Select 
              value={formData.state} 
              onValueChange={(value) => handleChange({ target: { name: 'state', value } } as any)}
            >
              <SelectTrigger 
                id="state" 
                className={`glass-input ${errors['state'] ? 'border-destructive' : ''}`}
                aria-invalid={!!errors['state']}
              >
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
            {errors['state'] && <FormMessage>{errors['state']}</FormMessage>}
          </FormItem>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormItem className="space-y-2">
            <Label htmlFor="postcode">Postcode <span className="text-destructive">*</span></Label>
            <FormControl>
              <Input
                id="postcode"
                name="postcode"
                placeholder="Enter postcode"
                value={formData.postcode}
                onChange={handleChange}
                className={`glass-input ${errors['postcode'] ? 'border-destructive' : ''}`}
                required
                aria-invalid={!!errors['postcode']}
              />
            </FormControl>
            {errors['postcode'] && <FormMessage>{errors['postcode']}</FormMessage>}
          </FormItem>
          
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
    </div>
  );
}
