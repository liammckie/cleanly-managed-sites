
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReplenishableItemList } from './ReplenishableItemList';

interface ReplenishablesStepProps {
  replenishables: {
    stock?: any[];
    supplies?: any[];
    notes?: string;
  };
  handleAddItem?: (type: 'stock' | 'supplies') => void;
  handleUpdateItem?: (type: 'stock' | 'supplies', index: number, field: string, value: any) => void;
  handleRemoveItem?: (type: 'stock' | 'supplies', index: number) => void;
}

export function ReplenishablesStep({
  replenishables,
  handleAddItem = () => {},
  handleUpdateItem = () => {},
  handleRemoveItem = () => {}
}: ReplenishablesStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Replenishable Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stock">
            <TabsList className="mb-4">
              <TabsTrigger value="stock">Stock Items</TabsTrigger>
              <TabsTrigger value="supplies">Supplies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stock">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Stock Items</h3>
                  <Button 
                    type="button" 
                    onClick={() => handleAddItem('stock')}
                    variant="outline"
                  >
                    Add Stock Item
                  </Button>
                </div>
                
                <ReplenishableItemList 
                  items={replenishables.stock || []}
                  type="stock"
                  onUpdateItem={handleUpdateItem}
                  onRemoveItem={handleRemoveItem}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="supplies">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Supplies</h3>
                  <Button 
                    type="button" 
                    onClick={() => handleAddItem('supplies')}
                    variant="outline"
                  >
                    Add Supply Item
                  </Button>
                </div>
                
                <ReplenishableItemList 
                  items={replenishables.supplies || []}
                  type="supplies"
                  onUpdateItem={handleUpdateItem}
                  onRemoveItem={handleRemoveItem}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Create a placeholder component for ReplenishableItemList
// In a real implementation, you would create this as a separate file
function ReplenishableItemList({ 
  items, 
  type, 
  onUpdateItem, 
  onRemoveItem 
}: { 
  items: any[], 
  type: 'stock' | 'supplies',
  onUpdateItem: (type: 'stock' | 'supplies', index: number, field: string, value: any) => void,
  onRemoveItem: (type: 'stock' | 'supplies', index: number) => void
}) {
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
