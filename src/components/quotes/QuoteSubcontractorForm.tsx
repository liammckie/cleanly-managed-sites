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
import { Frequency } from '@/types/common';

interface QuoteSubcontractorFormProps {
  onSubmit?: (subcontractorData: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  subcontractor?: any;
}

/**
 * A form component for managing quote subcontractors.
 */
const QuoteSubcontractorForm: React.FC<QuoteSubcontractorFormProps> = ({ 
  onSubmit, 
  open, 
  onOpenChange,
  subcontractor 
}) => {
  const isEditMode = !!subcontractor;
  const defaultValues = subcontractor || {
    name: '',
    description: '',
    cost: 0,
    frequency: 'monthly' as Frequency
  };

  const [formValues, setFormValues] = useState(defaultValues);
  
  const handleChange = (field: string, value: any) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formValues);
    }
  };

  const content = (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Subcontractor Name</Label>
          <Input 
            id="name"
            value={formValues.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter subcontractor name"
            required
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input 
            id="description"
            value={formValues.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the service provided"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cost">Cost ($)</Label>
          <Input 
            id="cost"
            type="number"
            min="0"
            step="0.01"
            value={formValues.cost}
            onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Select 
            value={formValues.frequency} 
            onValueChange={(value) => handleChange('frequency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="fortnightly">Fortnightly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
              <SelectItem value="once">Once-off</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        {onOpenChange && (
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {isEditMode ? 'Update Subcontractor' : 'Add Subcontractor'}
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
            <DialogTitle>{isEditMode ? 'Edit Subcontractor' : 'Add New Subcontractor'}</DialogTitle>
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
export default QuoteSubcontractorForm;
export { QuoteSubcontractorForm };
