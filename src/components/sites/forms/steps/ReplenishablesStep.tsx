
import React from 'react';
import { SiteFormData } from '../siteFormTypes';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface ReplenishablesStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
}

export function ReplenishablesStep({
  formData,
  handleNestedChange
}: ReplenishablesStepProps) {
  const replenishables = formData.replenishables || {
    stock: ['', '', '', '', ''],
    contactDetails: '',
    supplies: [],
    notes: ''
  };
  
  const supplies = replenishables.supplies || [];
  
  // Add a new empty supply
  const handleAddSupply = () => {
    const newSupply = {
      id: crypto.randomUUID(),
      name: '',
      quantity: 0,
      notes: ''
    };
    
    const updatedSupplies = [...supplies, newSupply];
    handleNestedChange('replenishables', 'supplies', updatedSupplies);
  };
  
  // Update a specific supply
  const handleUpdateSupply = (index: number, field: string, value: any) => {
    const updatedSupplies = [...supplies];
    updatedSupplies[index] = {
      ...updatedSupplies[index],
      [field]: value
    };
    
    handleNestedChange('replenishables', 'supplies', updatedSupplies);
  };
  
  // Remove a supply
  const handleRemoveSupply = (index: number) => {
    const updatedSupplies = supplies.filter((_, i) => i !== index);
    handleNestedChange('replenishables', 'supplies', updatedSupplies);
  };
  
  // Update stock items (array of strings)
  const handleStockChange = (index: number, value: string) => {
    const updatedStock = [...(replenishables.stock || [])];
    updatedStock[index] = value;
    
    handleNestedChange('replenishables', 'stock', updatedStock);
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Regular Supplies</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Stock Items</Label>
            <p className="text-sm text-muted-foreground">List items that need regular restocking</p>
            
            <div className="space-y-2">
              {(replenishables.stock || []).map((item, index) => (
                <Input
                  key={index}
                  value={item}
                  placeholder={`Stock item ${index + 1}`}
                  onChange={(e) => handleStockChange(index, e.target.value)}
                  className="w-full"
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact-details">Supply Contact Details</Label>
            <Textarea
              id="contact-details"
              placeholder="Who to contact for supplies"
              value={replenishables.contactDetails || ''}
              onChange={(e) => handleNestedChange('replenishables', 'contactDetails', e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="replenishables-notes">Notes</Label>
            <Textarea
              id="replenishables-notes"
              placeholder="Additional notes about supplies"
              value={replenishables.notes || ''}
              onChange={(e) => handleNestedChange('replenishables', 'notes', e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Managed Supplies</h3>
          <Button onClick={handleAddSupply} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Supply
          </Button>
        </div>
        
        {supplies.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No managed supplies added yet.</p>
            <p className="text-sm">Click 'Add Supply' to track specific items.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {supplies.map((supply, index) => (
              <div key={supply.id} className="border p-4 rounded-md relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6" 
                  onClick={() => handleRemoveSupply(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="space-y-3 mt-2">
                  <div>
                    <Label>Supply Name</Label>
                    <Input
                      value={supply.name}
                      onChange={(e) => handleUpdateSupply(index, 'name', e.target.value)}
                      placeholder="Supply name"
                      className="w-full mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={supply.quantity || 0}
                      onChange={(e) => handleUpdateSupply(index, 'quantity', Number(e.target.value))}
                      placeholder="Quantity"
                      className="w-full mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={supply.notes || ''}
                      onChange={(e) => handleUpdateSupply(index, 'notes', e.target.value)}
                      placeholder="Notes about this supply"
                      className="w-full mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
