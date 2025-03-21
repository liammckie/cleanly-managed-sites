
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SiteFormData } from '../siteFormTypes';

interface SecurityStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
}

export function SecurityStep({ formData, handleNestedChange }: SecurityStepProps) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="access-code">Access Code</Label>
          <Input
            id="access-code"
            type="password"
            placeholder="Enter access code"
            value={formData.securityDetails.accessCode}
            onChange={(e) => handleNestedChange('securityDetails', 'accessCode', e.target.value)}
            className="glass-input"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="alarm-code">Alarm Code</Label>
          <Input
            id="alarm-code"
            type="password"
            placeholder="Enter alarm code"
            value={formData.securityDetails.alarmCode}
            onChange={(e) => handleNestedChange('securityDetails', 'alarmCode', e.target.value)}
            className="glass-input"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="key-location">Key Location</Label>
        <Input
          id="key-location"
          placeholder="Enter key location"
          value={formData.securityDetails.keyLocation}
          onChange={(e) => handleNestedChange('securityDetails', 'keyLocation', e.target.value)}
          className="glass-input"
        />
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="out-of-hours" 
            checked={formData.securityDetails.outOfHoursAccess}
            onCheckedChange={(checked) => handleNestedChange('securityDetails', 'outOfHoursAccess', !!checked)}
          />
          <label
            htmlFor="out-of-hours"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Out of Hours Access Available
          </label>
        </div>
      </div>
    </div>
  );
}
