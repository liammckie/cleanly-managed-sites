
import React from 'react';
import { SiteFormData } from '../siteFormTypes';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface JobSpecificationsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
}

export function JobSpecificationsStep({ 
  formData, 
  handleNestedChange 
}: JobSpecificationsStepProps) {
  const jobSpecs = formData.jobSpecifications || {
    cleaningFrequency: 'daily',
    customFrequency: '',
    serviceDays: '',
    serviceTime: '',
    estimatedHours: '',
    equipmentRequired: '',
    scopeNotes: ''
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-medium">Job Specifications</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cleaning-frequency">Cleaning Frequency</Label>
            <select 
              id="cleaning-frequency"
              className="w-full p-2 border rounded-md"
              value={jobSpecs.cleaningFrequency || 'daily'}
              onChange={(e) => handleNestedChange('jobSpecifications', 'cleaningFrequency', e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          {(jobSpecs.cleaningFrequency || 'daily') === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="custom-frequency">Custom Frequency</Label>
              <Input
                id="custom-frequency"
                placeholder="Specify custom frequency"
                value={jobSpecs.customFrequency || ''}
                onChange={(e) => handleNestedChange('jobSpecifications', 'customFrequency', e.target.value)}
                className="w-full"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="service-days">Service Days</Label>
            <Input
              id="service-days"
              placeholder="e.g., Monday, Wednesday, Friday"
              value={jobSpecs.serviceDays || ''}
              onChange={(e) => handleNestedChange('jobSpecifications', 'serviceDays', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service-time">Service Time</Label>
            <Input
              id="service-time"
              placeholder="e.g., After 5:00 PM"
              value={jobSpecs.serviceTime || ''}
              onChange={(e) => handleNestedChange('jobSpecifications', 'serviceTime', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estimated-hours">Estimated Hours Per Service</Label>
            <Input
              id="estimated-hours"
              type="number"
              min="0"
              step="0.5"
              placeholder="0"
              value={jobSpecs.estimatedHours || ''}
              onChange={(e) => handleNestedChange('jobSpecifications', 'estimatedHours', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="equipment-required">Equipment Required</Label>
            <Textarea
              id="equipment-required"
              placeholder="List equipment needed for this job"
              value={jobSpecs.equipmentRequired || ''}
              onChange={(e) => handleNestedChange('jobSpecifications', 'equipmentRequired', e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scope-notes">Scope Notes</Label>
            <Textarea
              id="scope-notes"
              placeholder="Additional notes about job scope"
              value={jobSpecs.scopeNotes || ''}
              onChange={(e) => handleNestedChange('jobSpecifications', 'scopeNotes', e.target.value)}
              className="w-full"
              rows={4}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
