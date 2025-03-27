
import React from 'react';
import { Button } from '@/components/ui/button';

interface ReplenishableItemListProps { 
  items: any[]; 
  type: 'stock' | 'supplies';
  onUpdateItem: (type: 'stock' | 'supplies', index: number, field: string, value: any) => void;
  onRemoveItem: (type: 'stock' | 'supplies', index: number) => void;
}

export function ReplenishableItemList({ 
  items, 
  type, 
  onUpdateItem, 
  onRemoveItem 
}: ReplenishableItemListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No {type} items have been added yet.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id || index} className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{item.name || `Item ${index + 1}`}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(type, index)}
            >
              Remove
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>Quantity: {item.quantity || 0}</div>
            <div>Reorder Level: {item.reorderLevel || 0}</div>
            <div>Unit: {item.unit || 'ea'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
