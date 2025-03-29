import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Day, EmploymentType } from '@/types/common';

interface QuoteShiftFormProps {
  quoteId?: string;
  onSubmit?: (shiftData: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  shift?: any;
}

/**
 * A form component for managing quote shifts.
 */
const QuoteShiftForm: React.FC<QuoteShiftFormProps> = ({ 
  quoteId, 
  onSubmit, 
  open, 
  onOpenChange,
  shift 
}) => {
  const isEditMode = !!shift;
  const defaultValues = shift || {
    day: 'monday' as Day,
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 30,
    numberOfCleaners: 1,
    employmentType: 'casual' as EmploymentType,
    level: 1,
    allowances: [],
    estimatedCost: 0
  };

  const [formValues, setFormValues] = useState(defaultValues);
  
  const handleChange = (field: string, value: any) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        ...formValues,
        quoteId
      });
    }
  };

  const content = (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="day">Day</Label>
          <Select 
            value={formValues.day} 
            onValueChange={(value) => handleChange('day', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monday">Monday</SelectItem>
              <SelectItem value="tuesday">Tuesday</SelectItem>
              <SelectItem value="wednesday">Wednesday</SelectItem>
              <SelectItem value="thursday">Thursday</SelectItem>
              <SelectItem value="friday">Friday</SelectItem>
              <SelectItem value="saturday">Saturday</SelectItem>
              <SelectItem value="sunday">Sunday</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment Type</Label>
          <Select 
            value={formValues.employmentType} 
            onValueChange={(value) => handleChange('employmentType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="full-time">Full Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input 
            id="startTime"
            type="time"
            value={formValues.startTime}
            onChange={(e) => handleChange('startTime', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input 
            id="endTime"
            type="time"
            value={formValues.endTime}
            onChange={(e) => handleChange('endTime', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
          <Input 
            id="breakDuration"
            type="number"
            min="0"
            step="5"
            value={formValues.breakDuration}
            onChange={(e) => handleChange('breakDuration', parseInt(e.target.value) || 0)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numberOfCleaners">Number of Cleaners</Label>
          <Input 
            id="numberOfCleaners"
            type="number"
            min="1"
            value={formValues.numberOfCleaners}
            onChange={(e) => handleChange('numberOfCleaners', parseInt(e.target.value) || 1)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select 
            value={formValues.level.toString()} 
            onValueChange={(value) => handleChange('level', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4</SelectItem>
              <SelectItem value="5">Level 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
          <Input 
            id="estimatedCost"
            type="number"
            min="0"
            step="0.01"
            value={formValues.estimatedCost}
            onChange={(e) => handleChange('estimatedCost', parseFloat(e.target.value) || 0)}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        {onOpenChange && (
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {isEditMode ? 'Update Shift' : 'Add Shift'}
        </Button>
      </div>
    </form>
  );

  // If a dialog is requested, wrap in Dialog component
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Shift' : 'Add New Shift'}</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // Otherwise return the form directly
  return content;
};

// Export the component both as default and named export
export default QuoteShiftForm;
export { QuoteShiftForm };
