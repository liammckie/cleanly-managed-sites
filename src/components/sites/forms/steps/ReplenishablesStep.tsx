
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
