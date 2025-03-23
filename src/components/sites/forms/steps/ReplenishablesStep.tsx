
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash } from 'lucide-react';
import { SiteFormData } from '../siteFormTypes';

interface ReplenishablesStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  handleStockChange?: (index: number, value: string) => void;
}

export function ReplenishablesStep({ 
  formData, 
  handleNestedChange,
  handleStockChange
}: ReplenishablesStepProps) {
  const [newStockItem, setNewStockItem] = useState('');

  const addStockItem = () => {
    if (newStockItem.trim()) {
      const updatedStock = [...formData.replenishables.stock, newStockItem];
      handleNestedChange('replenishables', 'stock', updatedStock);
      setNewStockItem('');
    }
  };

  const removeStockItem = (indexToRemove: number) => {
    const updatedStock = formData.replenishables.stock.filter((_, index) => index !== indexToRemove);
    handleNestedChange('replenishables', 'stock', updatedStock);
  };

  const handleStockItemChange = (index: number, value: string) => {
    if (handleStockChange) {
      handleStockChange(index, value);
    } else {
      const updatedStock = [...formData.replenishables.stock];
      updatedStock[index] = value;
      handleNestedChange('replenishables', 'stock', updatedStock);
    }
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <h3 className="text-lg font-medium">Stock Items</h3>
      
      <div className="space-y-4">
        {formData.replenishables.stock.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              id={`stock-${index}`}
              placeholder="Enter stock item"
              value={item}
              onChange={(e) => handleStockItemChange(index, e.target.value)}
              className="glass-input flex-1"
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => removeStockItem(index)}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          placeholder="Add new stock item..."
          value={newStockItem}
          onChange={(e) => setNewStockItem(e.target.value)}
          className="glass-input flex-1"
          onKeyDown={(e) => e.key === 'Enter' && addStockItem()}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={addStockItem}
          disabled={!newStockItem.trim()}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add
        </Button>
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
