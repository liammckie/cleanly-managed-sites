
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SiteFormData } from '../siteFormTypes';

interface ReplenishablesStepProps {
  formData: SiteFormData;
  handleStockChange: (index: number, value: string) => void;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
}

export function ReplenishablesStep({ 
  formData, 
  handleStockChange, 
  handleNestedChange 
}: ReplenishablesStepProps) {
  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-lg font-medium">Stock Items</h3>
      
      <div className="space-y-4">
        {formData.replenishables.stock.map((item, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`stock-${index}`}>Stock Item {index + 1}</Label>
            <Input
              id={`stock-${index}`}
              placeholder="Enter stock item"
              value={item}
              onChange={(e) => handleStockChange(index, e.target.value)}
              className="glass-input"
            />
          </div>
        ))}
      </div>
      
      <div className="space-y-2 mt-6">
        <Label htmlFor="stock-contact">Contact Details for Replenishment</Label>
        <Textarea
          id="stock-contact"
          placeholder="Enter contact details for stock replenishment..."
          rows={3}
          value={formData.replenishables.contactDetails}
          onChange={(e) => handleNestedChange('replenishables', 'contactDetails', e.target.value)}
          className="glass-input resize-none"
        />
      </div>
    </div>
  );
}
