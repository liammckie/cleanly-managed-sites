import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { SiteFormData } from '../siteFormTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface JobSpecificationsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
}

const JobSpecificationsStep = ({ formData, handleNestedChange }) => {
  // Local state for area management
  const [areaName, setAreaName] = useState('');
  const [areaDetails, setAreaDetails] = useState('');
  
  // Handle adding a new area
  const handleAddArea = () => {
    if (areaName.trim() === '') return;
    
    const newArea: AreaSpecification = {
      name: areaName,
      details: areaDetails
    };
    
    const updatedAreas = [...(formData.jobSpecifications.areas || []), newArea];
    handleNestedChange('jobSpecifications', 'areas', updatedAreas);
    
    // Reset inputs
    setAreaName('');
    setAreaDetails('');
  };
  
  // Handle removing an area
  const handleRemoveArea = (indexToRemove: number) => {
    const updatedAreas = formData.jobSpecifications.areas?.filter(
      (_, index) => index !== indexToRemove
    );
    handleNestedChange('jobSpecifications', 'areas', updatedAreas);
  };

  // Calculate hours per week
  const hoursPerWeek = formData.jobSpecifications.daysPerWeek * formData.jobSpecifications.hoursPerDay;
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-xl font-semibold mb-4">Job Requirements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="days-per-week">Days Per Week</Label>
            <Input
              id="days-per-week"
              type="number"
              min="1"
              max="7"
              value={formData.jobSpecifications.daysPerWeek}
              onChange={(e) => handleNestedChange('jobSpecifications', 'daysPerWeek', Number(e.target.value))}
              className="glass-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hours-per-day">Hours Per Day</Label>
            <Input
              id="hours-per-day"
              type="number"
              min="0.5"
              step="0.5"
              value={formData.jobSpecifications.hoursPerDay}
              onChange={(e) => handleNestedChange('jobSpecifications', 'hoursPerDay', Number(e.target.value))}
              className="glass-input"
            />
          </div>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-md text-center my-4">
          <p className="text-sm text-muted-foreground">Total Hours Per Week</p>
          <p className="text-2xl font-bold">{hoursPerWeek}</p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Working Days</Label>
              <div className="grid grid-cols-4 gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day}`}
                      checked={formData.jobSpecifications.workingDays?.[day] || false}
                      onCheckedChange={(checked) => {
                        const workingDays = {
                          ...(formData.jobSpecifications.workingDays || {}),
                          [day]: checked
                        };
                        handleNestedChange('jobSpecifications', 'workingDays', workingDays);
                      }}
                    />
                    <Label htmlFor={`day-${day}`} className="capitalize">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Areas to Clean</Label>
              <div className="flex flex-wrap gap-2">
                {['Reception', 'Offices', 'Kitchen', 'Bathrooms', 'Warehouse', 'Common Areas', 'Exterior'].map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={`area-${area}`}
                      checked={formData.jobSpecifications.areas?.includes(area) || false}
                      onCheckedChange={(checked) => {
                        let areas = [...(formData.jobSpecifications.areas || [])];
                        if (checked) {
                          if (!areas.includes(area)) {
                            areas.push(area);
                          }
                        } else {
                          areas = areas.filter(a => a !== area);
                        }
                        handleNestedChange('jobSpecifications', 'areas', areas);
                      }}
                    />
                    <Label htmlFor={`area-${area}`}>{area}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="special-equipment"
                checked={formData.jobSpecifications.requiresSpecialEquipment || false}
                onCheckedChange={(checked) => {
                  handleNestedChange('jobSpecifications', 'requiresSpecialEquipment', checked);
                  if (!checked) {
                    handleNestedChange('jobSpecifications', 'equipmentDetails', '');
                  }
                }}
              />
              <Label htmlFor="special-equipment">Requires Special Equipment</Label>
            </div>
            
            {formData.jobSpecifications.requiresSpecialEquipment && (
              <Textarea
                id="equipment-details"
                placeholder="Describe the special equipment needed..."
                rows={3}
                value={formData.jobSpecifications.equipmentDetails || ''}
                onChange={(e) => handleNestedChange('jobSpecifications', 'equipmentDetails', e.target.value)}
                className="glass-input resize-none"
              />
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cleaning-instructions">Cleaning Instructions</Label>
            <Textarea
              id="cleaning-instructions"
              placeholder="Enter detailed cleaning instructions..."
              rows={4}
              value={formData.jobSpecifications.cleaningInstructions || ''}
              onChange={(e) => handleNestedChange('jobSpecifications', 'cleaningInstructions', e.target.value)}
              className="glass-input resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="job-notes">Additional Notes</Label>
            <Textarea
              id="job-notes"
              placeholder="Enter any additional notes about the job specifications..."
              rows={3}
              value={formData.jobSpecifications.notes}
              onChange={(e) => handleNestedChange('jobSpecifications', 'notes', e.target.value)}
              className="glass-input resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSpecificationsStep;
