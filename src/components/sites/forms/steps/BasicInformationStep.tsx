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
import { SiteStatus } from '../../SiteCard';
import { FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { useClients } from '@/hooks/useClients';
import { ClientSelect } from '../../clients/ClientSelect';
import { Switch } from '@/components/ui/switch';
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
              if (formData.useClientInfo) {
                clientData.toggleUseClientInfo(false);
              }
            }}
            error={errors['clientId']}
          />
          {errors['clientId'] && <FormMessage>{errors['clientId']}</FormMessage>}
        </FormItem>
        
        {formData.clientId && formData.clientId.trim() !== '' && (
          <FormItem className="flex items-center space-x-2">
            <Switch 
              id="useClientInfo" 
              checked={formData.useClientInfo}
              onCheckedChange={clientData.toggleUseClientInfo}
            />
            <Label htmlFor="useClientInfo" className="cursor-pointer">
              Use client information for billing details
            </Label>
          </FormItem>
        )}
        
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
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Contact Information</h3>
        
        <div className="space-y-4">
          <FormItem className="space-y-2">
            <Label htmlFor="representative">Representative Name <span className="text-destructive">*</span></Label>
            <FormControl>
              <Input
                id="representative"
                name="representative"
                placeholder="Enter representative name"
                value={formData.representative}
                onChange={handleChange}
                className={`glass-input ${errors['representative'] ? 'border-destructive' : ''}`}
                required
                aria-invalid={!!errors['representative']}
              />
            </FormControl>
            {errors['representative'] && <FormMessage>{errors['representative']}</FormMessage>}
          </FormItem>
          
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
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Financial Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyCost">Monthly Cost ($)</Label>
            <Input
              id="monthlyCost"
              name="monthlyCost"
              type="number"
              placeholder="Enter monthly cost"
              value={formData.monthlyCost || ''}
              onChange={(e) => handleChange({
                target: {
                  name: 'monthlyCost',
                  value: e.target.value ? parseFloat(e.target.value) : undefined
                }
              } as any)}
              className="glass-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monthlyRevenue">Monthly Revenue ($)</Label>
            <Input
              id="monthlyRevenue"
              name="monthlyRevenue"
              type="number"
              placeholder="Enter monthly revenue"
              value={formData.monthlyRevenue || ''}
              onChange={(e) => handleChange({
                target: {
                  name: 'monthlyRevenue',
                  value: e.target.value ? parseFloat(e.target.value) : undefined
                }
              } as any)}
              className="glass-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
