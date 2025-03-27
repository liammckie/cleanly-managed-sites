
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SiteFormData } from '../types/siteFormData';

interface JobSpecificationsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: string, field: string, value: any) => void;
}

export function JobSpecificationsStep({ formData, handleNestedChange }: JobSpecificationsStepProps) {
  const jobSpecs = formData.jobSpecifications || {};

  const handleChange = (field: string, value: any) => {
    handleNestedChange('jobSpecifications', field, value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cleaningFrequency">Cleaning Frequency</Label>
              <Select
                value={jobSpecs.cleaningFrequency || 'daily'}
                onValueChange={(value) => handleChange('cleaningFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="fortnightly">Fortnightly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {jobSpecs.cleaningFrequency === 'custom' && (
              <div>
                <Label htmlFor="customFrequency">Custom Frequency</Label>
                <Input
                  id="customFrequency"
                  value={jobSpecs.customFrequency || ''}
                  onChange={(e) => handleChange('customFrequency', e.target.value)}
                  placeholder="Specify custom frequency"
                />
              </div>
            )}

            <div>
              <Label htmlFor="serviceDays">Service Days</Label>
              <Input
                id="serviceDays"
                value={jobSpecs.serviceDays || ''}
                onChange={(e) => handleChange('serviceDays', e.target.value)}
                placeholder="e.g. Monday, Wednesday, Friday"
              />
            </div>

            <div>
              <Label htmlFor="serviceTime">Service Time</Label>
              <Input
                id="serviceTime"
                value={jobSpecs.serviceTime || ''}
                onChange={(e) => handleChange('serviceTime', e.target.value)}
                placeholder="e.g. 6:00 PM - 9:00 PM"
              />
            </div>

            <div>
              <Label htmlFor="daysPerWeek">Days Per Week</Label>
              <Input
                id="daysPerWeek"
                type="number"
                min={1}
                max={7}
                value={jobSpecs.daysPerWeek || 5}
                onChange={(e) => handleChange('daysPerWeek', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="hoursPerDay">Hours Per Day</Label>
              <Input
                id="hoursPerDay"
                type="number"
                min={0.5}
                step={0.5}
                value={jobSpecs.hoursPerDay || 8}
                onChange={(e) => handleChange('hoursPerDay', parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="directEmployees">Direct Employees</Label>
              <Input
                id="directEmployees"
                type="number"
                min={0}
                value={jobSpecs.directEmployees || 0}
                onChange={(e) => handleChange('directEmployees', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                value={jobSpecs.estimatedHours || ''}
                onChange={(e) => handleChange('estimatedHours', e.target.value)}
                placeholder="Total estimated hours"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="equipmentRequired">Equipment Required</Label>
            <Textarea
              id="equipmentRequired"
              value={jobSpecs.equipmentRequired || ''}
              onChange={(e) => handleChange('equipmentRequired', e.target.value)}
              placeholder="List required equipment"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="scopeNotes">Scope Notes</Label>
            <Textarea
              id="scopeNotes"
              value={jobSpecs.scopeNotes || ''}
              onChange={(e) => handleChange('scopeNotes', e.target.value)}
              placeholder="Additional notes about the scope of work"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">General Notes</Label>
            <Textarea
              id="notes"
              value={jobSpecs.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="General notes about the job"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
