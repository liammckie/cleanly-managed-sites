
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
  addReplenishable?: () => void;
  updateReplenishable?: (index: number, field: string, value: any) => void;
  removeReplenishable?: (index: number) => void;
  handleStockChange?: (index: number, value: string) => void;
}

export function ReplenishablesStep({ 
  formData, 
  handleNestedChange,
  addReplenishable,
  updateReplenishable,
  removeReplenishable,
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

  // If addReplenishable is provided, use it; otherwise, use addStockItem
  const handleAddItem = addReplenishable || addStockItem;

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
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Remove stock item</span>
            </Button>
          </div>
        ))}
        
        <div className="flex items-center gap-2">
          <Input
            id="new-stock-item"
            placeholder="Add new stock item"
            value={newStockItem}
            onChange={(e) => setNewStockItem(e.target.value)}
            className="glass-input flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddItem();
              }
            }}
          />
          <Button 
            type="button" 
            onClick={handleAddItem}
            variant="outline"
            className="flex items-center gap-1 shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="replenishables-notes">Notes</Label>
        <Textarea
          id="replenishables-notes"
          placeholder="Add any notes about stock and replenishables..."
          value={formData.replenishables.notes || ''}
          onChange={(e) => handleNestedChange('replenishables', 'notes', e.target.value)}
          className="glass-input"
          rows={3}
        />
      </div>
    </div>
  );
}
