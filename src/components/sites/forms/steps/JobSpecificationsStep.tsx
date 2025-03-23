
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { SiteFormData } from '../siteFormTypes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface JobSpecificationsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
}

export function JobSpecificationsStep({ formData, handleNestedChange }: JobSpecificationsStepProps) {
  const weekdays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  const handleWeekdayChange = (day: string, checked: boolean) => {
    const currentDays = formData.jobSpecifications.workingDays || {};
    currentDays[day] = checked;
    
    // Count selected days
    const selectedDaysCount = Object.values(currentDays).filter(Boolean).length;
    
    handleNestedChange('jobSpecifications', 'workingDays', currentDays);
    // Also update daysPerWeek to match selected days count
    handleNestedChange('jobSpecifications', 'daysPerWeek', selectedDaysCount);
  };

  const handleServiceDeliveryChange = (value: string) => {
    const isDirectService = value === 'direct';
    handleNestedChange('jobSpecifications', 'serviceDeliveryType', value);
    handleNestedChange('jobSpecifications', 'directEmployees', isDirectService);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Service Delivery Options</h3>
        
        <Card className="p-4 border border-muted">
          <Label className="mb-2 block">How will services be delivered?</Label>
          <RadioGroup 
            value={formData.jobSpecifications.serviceDeliveryType || 'direct'} 
            onValueChange={handleServiceDeliveryChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-md">
              <RadioGroupItem value="direct" id="direct" />
              <Label htmlFor="direct" className="cursor-pointer">Direct Employees</Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-md">
              <RadioGroupItem value="contractor" id="contractor" />
              <Label htmlFor="contractor" className="cursor-pointer">Through Contractors</Label>
            </div>
          </RadioGroup>
        </Card>

        {formData.jobSpecifications.serviceDeliveryType === 'contractor' && (
          <Card className="p-4 border border-muted mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="annual-contractor-cost">Annual Contractor Cost</Label>
                <Input
                  id="annual-contractor-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter annual cost"
                  value={formData.jobSpecifications.annualContractorCost || ''}
                  onChange={(e) => handleNestedChange('jobSpecifications', 'annualContractorCost', parseFloat(e.target.value))}
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractor-invoice-frequency">Contractor Invoice Frequency</Label>
                <select
                  id="contractor-invoice-frequency"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 glass-input"
                  value={formData.jobSpecifications.contractorInvoiceFrequency || 'monthly'}
                  onChange={(e) => handleNestedChange('jobSpecifications', 'contractorInvoiceFrequency', e.target.value)}
                >
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>
          </Card>
        )}
        
        <h3 className="text-lg font-medium mt-6">Cleaning Schedule</h3>
        
        <Card className="p-4 border border-muted">
          <div className="space-y-2">
            <Label>Working Days</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {weekdays.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${day.value}`} 
                    checked={formData.jobSpecifications.workingDays?.[day.value] || false}
                    onCheckedChange={(checked) => handleWeekdayChange(day.value, !!checked)}
                  />
                  <Label 
                    htmlFor={`day-${day.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="days-per-week">Days Per Week (auto-calculated)</Label>
            <Input
              id="days-per-week"
              type="number"
              min="0"
              max="7"
              value={formData.jobSpecifications.daysPerWeek}
              readOnly
              className="glass-input bg-muted/30"
            />
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
