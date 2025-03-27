
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SiteFormData } from '../types/siteFormData';

interface JobSpecificationsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: string, field: string, value: any) => void;
}

export function JobSpecificationsStep({ formData, handleNestedChange }: JobSpecificationsStepProps) {
  const jobSpec = formData.jobSpecifications || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="daysPerWeek">Days Per Week</Label>
          <Input
            id="daysPerWeek"
            type="number"
            min="1"
            max="7"
            value={jobSpec.daysPerWeek || ''}
            onChange={(e) => handleNestedChange('jobSpecifications', 'daysPerWeek', e.target.valueAsNumber)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hoursPerDay">Hours Per Day</Label>
          <Input
            id="hoursPerDay"
            type="number"
            min="0"
            step="0.5"
            value={jobSpec.hoursPerDay || ''}
            onChange={(e) => handleNestedChange('jobSpecifications', 'hoursPerDay', e.target.valueAsNumber)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="directEmployees">Direct Employees</Label>
          <Input
            id="directEmployees"
            type="number"
            min="0"
            value={jobSpec.directEmployees || ''}
            onChange={(e) => handleNestedChange('jobSpecifications', 'directEmployees', e.target.valueAsNumber)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cleaningFrequency">Cleaning Frequency</Label>
          <Select
            value={jobSpec.cleaningFrequency || ''}
            onValueChange={(value) => handleNestedChange('jobSpecifications', 'cleaningFrequency', value)}
          >
            <SelectTrigger id="cleaningFrequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {jobSpec.cleaningFrequency === 'custom' && (
        <div className="space-y-2">
          <Label htmlFor="customFrequency">Custom Frequency</Label>
          <Input
            id="customFrequency"
            value={jobSpec.customFrequency || ''}
            onChange={(e) => handleNestedChange('jobSpecifications', 'customFrequency', e.target.value)}
            placeholder="Specify custom frequency"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="serviceDays">Service Days</Label>
        <Input
          id="serviceDays"
          value={jobSpec.serviceDays || ''}
          onChange={(e) => handleNestedChange('jobSpecifications', 'serviceDays', e.target.value)}
          placeholder="e.g. Monday, Wednesday, Friday"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="serviceTime">Service Time</Label>
        <Input
          id="serviceTime"
          value={jobSpec.serviceTime || ''}
          onChange={(e) => handleNestedChange('jobSpecifications', 'serviceTime', e.target.value)}
          placeholder="e.g. After 5:00 PM"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="estimatedHours">Estimated Hours</Label>
        <Input
          id="estimatedHours"
          value={jobSpec.estimatedHours || ''}
          onChange={(e) => handleNestedChange('jobSpecifications', 'estimatedHours', e.target.value)}
          placeholder="e.g. 20 hours per week"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="equipmentRequired">Equipment Required</Label>
        <Textarea
          id="equipmentRequired"
          value={jobSpec.equipmentRequired || ''}
          onChange={(e) => handleNestedChange('jobSpecifications', 'equipmentRequired', e.target.value)}
          placeholder="List required equipment"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="scopeNotes">Scope Notes</Label>
        <Textarea
          id="scopeNotes"
          value={jobSpec.scopeNotes || ''}
          onChange={(e) => handleNestedChange('jobSpecifications', 'scopeNotes', e.target.value)}
          placeholder="Additional scope details"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="weeklyContractorCost">Weekly Contractor Cost ($)</Label>
        <Input
          id="weeklyContractorCost"
          type="number"
          min="0"
          step="0.01"
          value={jobSpec.weeklyContractorCost || ''}
          onChange={(e) => handleNestedChange('jobSpecifications', 'weeklyContractorCost', e.target.valueAsNumber)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={jobSpec.notes || ''}
          onChange={(e) => handleNestedChange('jobSpecifications', 'notes', e.target.value)}
          placeholder="Any additional notes about the job specifications"
          rows={4}
        />
      </div>
    </div>
  );
}
