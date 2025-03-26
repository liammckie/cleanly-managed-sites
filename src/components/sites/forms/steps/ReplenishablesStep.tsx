
// Let's modify only the part with the contactDetails error
import React from 'react';
import { SiteFormData } from '../siteFormTypes';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ReplenishablesStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: string, field: string, value: any) => void;
}

export function ReplenishablesStep({ 
  formData, 
  handleNestedChange 
}: ReplenishablesStepProps) {
  // Initialize replenishables object if it doesn't exist
  const replenishables = formData.replenishables || { 
    stock: [], 
    supplies: [],
    notes: '' 
  };
  
  // Handle adding a new stock item
  const addStockItem = () => {
    const updatedStock = [...(replenishables.stock || []), ''];
    handleNestedChange('replenishables', 'stock', updatedStock);
  };
  
  // Handle updating a stock item
  const updateStockItem = (index: number, value: string) => {
    const updatedStock = [...(replenishables.stock || [])];
    updatedStock[index] = value;
    handleNestedChange('replenishables', 'stock', updatedStock);
  };
  
  // Handle removing a stock item
  const removeStockItem = (index: number) => {
    const updatedStock = [...(replenishables.stock || [])];
    updatedStock.splice(index, 1);
    handleNestedChange('replenishables', 'stock', updatedStock);
  };
  
  // Handle adding a new supplies item
  const addSuppliesItem = () => {
    const updatedSupplies = [...(replenishables.supplies || []), ''];
    handleNestedChange('replenishables', 'supplies', updatedSupplies);
  };
  
  // Handle updating a supplies item
  const updateSuppliesItem = (index: number, value: string) => {
    const updatedSupplies = [...(replenishables.supplies || [])];
    updatedSupplies[index] = value;
    handleNestedChange('replenishables', 'supplies', updatedSupplies);
  };
  
  // Handle removing a supplies item
  const removeSuppliesItem = (index: number) => {
    const updatedSupplies = [...(replenishables.supplies || [])];
    updatedSupplies.splice(index, 1);
    handleNestedChange('replenishables', 'supplies', updatedSupplies);
  };
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4">Stock Items</h3>
        
        <div className="space-y-4">
          {(replenishables.stock || []).map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => updateStockItem(index, e.target.value)}
                placeholder="Item name, e.g. Bleach, Toilet Paper"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => removeStockItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addStockItem}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Stock Item
          </Button>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4">Supplies</h3>
        
        <div className="space-y-4">
          {(replenishables.supplies || []).map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => updateSuppliesItem(index, e.target.value)}
                placeholder="Item name, e.g. Mop Heads, Cleaning Cloths"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => removeSuppliesItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addSuppliesItem}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Supply Item
          </Button>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4">Notes</h3>
        
        <div className="space-y-2">
          <Label htmlFor="replenishables-notes">Additional Notes</Label>
          <Textarea
            id="replenishables-notes"
            value={replenishables.notes || ''}
            onChange={(e) => handleNestedChange('replenishables', 'notes', e.target.value)}
            placeholder="Add any additional notes on replenishables..."
            rows={4}
          />
        </div>
        
        {/* Safe access to the contactDetails property */}
        {'contactDetails' in replenishables && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="replenishables-contact">Contact Details</Label>
            <Input
              id="replenishables-contact"
              value={(replenishables as any).contactDetails || ''}
              onChange={(e) => handleNestedChange('replenishables', 'contactDetails', e.target.value)}
              placeholder="Supplier contact details..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
