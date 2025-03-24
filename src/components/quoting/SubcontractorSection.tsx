
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subcontractor, Frequency } from '@/lib/award/types';
import { formatCurrency } from '@/lib/award/utils';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SubcontractorSectionProps {
  subcontractors: Subcontractor[];
  quoteId?: string;
  onChange: (subcontractors: Subcontractor[]) => void;
}

export function SubcontractorSection({ subcontractors, quoteId, onChange }: SubcontractorSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSubcontractor, setNewSubcontractor] = useState<Partial<Subcontractor>>({
    name: '',
    services: [],
    description: '',
    cost: 0,
    frequency: 'monthly',
    email: '',
    phone: ''
  });

  const handleAddSubcontractor = () => {
    if (!newSubcontractor.name) return;

    const subcontractor: Subcontractor = {
      id: uuidv4(),
      name: newSubcontractor.name,
      services: newSubcontractor.services || [],
      description: newSubcontractor.description || '',
      cost: newSubcontractor.cost || 0,
      frequency: newSubcontractor.frequency as Frequency || 'monthly',
      email: newSubcontractor.email,
      phone: newSubcontractor.phone,
      notes: '',
    };

    onChange([...subcontractors, subcontractor]);
    
    // Reset the form
    setNewSubcontractor({
      name: '',
      services: [],
      description: '',
      cost: 0,
      frequency: 'monthly',
      email: '',
      phone: ''
    });
    
    setIsAdding(false);
  };

  const handleRemoveSubcontractor = (id: string) => {
    onChange(subcontractors.filter(s => s.id !== id));
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewSubcontractor({
      name: '',
      services: [],
      description: '',
      cost: 0,
      frequency: 'monthly'
    });
  };

  const calculateMonthlyAmount = (subcontractor: Subcontractor): number => {
    if (!subcontractor.cost) return 0;
    
    const cost = subcontractor.cost;
    
    switch (subcontractor.frequency) {
      case 'daily':
        return cost * 22; // Average working days in a month
      case 'weekly':
        return cost * 4.33; // Average weeks in a month
      case 'fortnightly':
        return cost * 2.17; // Average fortnights in a month
      case 'monthly':
        return cost;
      case 'quarterly':
        return cost / 3;
      case 'annually':
        return cost / 12;
      default:
        return cost; // Default to the cost value
    }
  };

  const totalMonthlyAmount = subcontractors.reduce((total, sub) => 
    total + calculateMonthlyAmount(sub), 0);

  const totalAnnualAmount = totalMonthlyAmount * 12;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Subcontractors & Services</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </CardHeader>

      <CardContent>
        {subcontractors.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No additional services have been added to this quote.</p>
            <p className="mt-1">Click "Add Service" to include subcontractors or additional services.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* List of existing subcontractors */}
            {subcontractors.map((sub) => (
              <div 
                key={sub.id} 
                className="p-4 border rounded-lg bg-card"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{sub.name}</h3>
                    <p className="text-muted-foreground text-sm">{sub.services?.join(', ') || 'No services specified'}</p>
                    <p className="mt-1">{sub.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(sub.cost || 0)} / {sub.frequency === 'one_time' ? 'one time' : sub.frequency}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {sub.frequency !== 'one_time' && sub.frequency !== 'per_event' && (
                        `${formatCurrency(calculateMonthlyAmount(sub))} monthly`
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive mt-2"
                      onClick={() => handleRemoveSubcontractor(sub.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new subcontractor form */}
            {isAdding && (
              <div className="p-4 border border-primary rounded-lg bg-primary/5">
                <h3 className="font-medium mb-4">Add New Service or Subcontractor</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subName">Name</Label>
                      <Input 
                        id="subName" 
                        value={newSubcontractor.name}
                        onChange={(e) => setNewSubcontractor({...newSubcontractor, name: e.target.value})}
                        placeholder="Subcontractor or service name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subServices">Services</Label>
                      <Input 
                        id="subServices" 
                        value={newSubcontractor.services?.join(', ') || ''}
                        onChange={(e) => setNewSubcontractor({...newSubcontractor, services: e.target.value.split(',').map(s => s.trim())})}
                        placeholder="Service types, comma separated"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subDescription">Description</Label>
                    <Textarea 
                      id="subDescription" 
                      value={newSubcontractor.description || ''}
                      onChange={(e) => setNewSubcontractor({...newSubcontractor, description: e.target.value})}
                      placeholder="Describe the service or subcontractor work"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subCost">Cost</Label>
                      <Input 
                        id="subCost" 
                        type="number"
                        min="0"
                        step="0.01"
                        value={newSubcontractor.cost || ''}
                        onChange={(e) => setNewSubcontractor({...newSubcontractor, cost: parseFloat(e.target.value) || 0})}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subFrequency">Frequency</Label>
                      <Select 
                        value={newSubcontractor.frequency as string} 
                        onValueChange={(value) => setNewSubcontractor({...newSubcontractor, frequency: value as Frequency})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="fortnightly">Fortnightly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                            <SelectItem value="one_time">One Time</SelectItem>
                            <SelectItem value="per_event">Per Event</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={handleCancelAdd}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddSubcontractor}
                      disabled={!newSubcontractor.name}
                    >
                      Add Service
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Summary of costs */}
            {subcontractors.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center mb-1">
                  <div>Monthly Subcontractor/Services Cost:</div>
                  <div className="font-semibold">{formatCurrency(totalMonthlyAmount)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>Annual Subcontractor/Services Cost:</div>
                  <div className="font-semibold">{formatCurrency(totalAnnualAmount)}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2
  }).format(value);
}
