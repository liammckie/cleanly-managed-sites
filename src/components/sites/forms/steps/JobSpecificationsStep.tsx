
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiteFormData } from '../siteFormTypes';

interface JobSpecificationsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
}

export function JobSpecificationsStep({ formData, handleNestedChange }: JobSpecificationsStepProps) {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Cleaning Schedule</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="days-per-week">Days Per Week</Label>
            <Select 
              value={String(formData.jobSpecifications.daysPerWeek)} 
              onValueChange={(value) => handleNestedChange('jobSpecifications', 'daysPerWeek', parseInt(value))}
            >
              <SelectTrigger id="days-per-week" className="glass-input">
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent className="glass">
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hours-per-day">Hours Per Day</Label>
            <Input
              id="hours-per-day"
              type="number"
              min="1"
              max="24"
              value={formData.jobSpecifications.hoursPerDay}
              onChange={(e) => handleNestedChange('jobSpecifications', 'hoursPerDay', parseInt(e.target.value))}
              className="glass-input"
            />
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="direct-employees" 
              checked={formData.jobSpecifications.directEmployees}
              onCheckedChange={(checked) => handleNestedChange('jobSpecifications', 'directEmployees', !!checked)}
            />
            <label
              htmlFor="direct-employees"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Direct Employees (unchecked if subcontractors)
            </label>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="job-notes">Special Instructions / Notes</Label>
          <Textarea
            id="job-notes"
            placeholder="Enter any special instructions or notes..."
            rows={4}
            value={formData.jobSpecifications.notes}
            onChange={(e) => handleNestedChange('jobSpecifications', 'notes', e.target.value)}
            className="glass-input resize-none"
          />
        </div>
      </div>
    </div>
  );
}
