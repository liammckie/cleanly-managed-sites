
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SiteFormData } from '../types/siteFormData';

interface JobSpecificationsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: string, field: string, value: any) => void;
}

export function JobSpecificationsStep({
  formData,
  handleNestedChange
}: JobSpecificationsStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="daysPerWeek">Days Per Week</Label>
                <Input
                  id="daysPerWeek"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.jobSpecifications?.daysPerWeek || ''}
                  onChange={(e) => handleNestedChange('jobSpecifications', 'daysPerWeek', parseInt(e.target.value) || '')}
                />
              </div>
              
              <div>
                <Label htmlFor="hoursPerDay">Hours Per Day</Label>
                <Input
                  id="hoursPerDay"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.jobSpecifications?.hoursPerDay || ''}
                  onChange={(e) => handleNestedChange('jobSpecifications', 'hoursPerDay', parseFloat(e.target.value) || '')}
                />
              </div>
              
              <div>
                <Label htmlFor="directEmployees">Direct Employees</Label>
                <Input
                  id="directEmployees"
                  type="number"
                  min="0"
                  value={formData.jobSpecifications?.directEmployees || ''}
                  onChange={(e) => handleNestedChange('jobSpecifications', 'directEmployees', parseInt(e.target.value) || '')}
                />
              </div>
              
              <div>
                <Label htmlFor="cleaningFrequency">Cleaning Frequency</Label>
                <Input
                  id="cleaningFrequency"
                  value={formData.jobSpecifications?.cleaningFrequency || ''}
                  onChange={(e) => handleNestedChange('jobSpecifications', 'cleaningFrequency', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="serviceDays">Service Days</Label>
                <Input
                  id="serviceDays"
                  value={formData.jobSpecifications?.serviceDays || ''}
                  onChange={(e) => handleNestedChange('jobSpecifications', 'serviceDays', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="serviceTime">Service Time</Label>
                <Input
                  id="serviceTime"
                  value={formData.jobSpecifications?.serviceTime || ''}
                  onChange={(e) => handleNestedChange('jobSpecifications', 'serviceTime', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  value={formData.jobSpecifications?.estimatedHours || ''}
                  onChange={(e) => handleNestedChange('jobSpecifications', 'estimatedHours', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="equipmentRequired">Equipment Required</Label>
                <Input
                  id="equipmentRequired"
                  value={formData.jobSpecifications?.equipmentRequired || ''}
                  onChange={(e) => handleNestedChange('jobSpecifications', 'equipmentRequired', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="scopeNotes">Scope Notes</Label>
              <Textarea
                id="scopeNotes"
                rows={4}
                value={formData.jobSpecifications?.scopeNotes || ''}
                onChange={(e) => handleNestedChange('jobSpecifications', 'scopeNotes', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                rows={4}
                value={formData.jobSpecifications?.notes || ''}
                onChange={(e) => handleNestedChange('jobSpecifications', 'notes', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
