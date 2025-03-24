
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Subcontractor } from '@/lib/award/types';
import { toast } from 'sonner';
import { Plus, Trash2, Edit } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SubcontractorSectionProps {
  subcontractors: Subcontractor[];
  onSubcontractorsChange: (subcontractors: Subcontractor[]) => void;
}

export function SubcontractorSection({ subcontractors, onSubcontractorsChange }: SubcontractorSectionProps) {
  const [isAddingSubcontractor, setIsAddingSubcontractor] = useState(false);
  const [newSubcontractor, setNewSubcontractor] = useState<Partial<Subcontractor>>({
    name: '',
    service: '',
    cost: 0,
    frequency: 'weekly',
    notes: ''
  });
  
  const handleInputChange = (field: string, value: any) => {
    setNewSubcontractor(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddSubcontractor = () => {
    if (!newSubcontractor.name || !newSubcontractor.service || !newSubcontractor.cost) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const subcontractorToAdd: Subcontractor = {
      id: uuidv4(),
      name: newSubcontractor.name,
      service: newSubcontractor.service,
      cost: typeof newSubcontractor.cost === 'number' ? newSubcontractor.cost : parseFloat(newSubcontractor.cost as string),
      frequency: newSubcontractor.frequency as 'daily' | 'weekly' | 'fortnightly' | 'monthly',
      notes: newSubcontractor.notes
    };
    
    const updatedSubcontractors = [...subcontractors, subcontractorToAdd];
    onSubcontractorsChange(updatedSubcontractors);
    
    // Reset form
    setNewSubcontractor({
      name: '',
      service: '',
      cost: 0,
      frequency: 'weekly',
      notes: ''
    });
    
    setIsAddingSubcontractor(false);
    toast.success('Subcontractor added successfully');
  };
  
  const handleDeleteSubcontractor = (subcontractorId: string) => {
    const updatedSubcontractors = subcontractors.filter(s => s.id !== subcontractorId);
    onSubcontractorsChange(updatedSubcontractors);
    toast.success('Subcontractor removed');
  };
  
  const formatFrequency = (frequency: string): string => {
    switch (frequency) {
      case 'daily': return 'Per day';
      case 'weekly': return 'Per week';
      case 'fortnightly': return 'Per fortnight';
      case 'monthly': return 'Per month';
      default: return frequency;
    }
  };
  
  const calculateSubcontractorMonthlyCost = (subcontractor: Subcontractor): number => {
    switch (subcontractor.frequency) {
      case 'daily':
        return subcontractor.cost * 21.67; // Average work days per month
      case 'weekly':
        return subcontractor.cost * 4.33; // Average weeks per month
      case 'fortnightly':
        return subcontractor.cost * 2.167; // Average fortnights per month
      case 'monthly':
        return subcontractor.cost;
      default:
        return subcontractor.cost;
    }
  };
  
  const getTotalMonthlyCost = (): number => {
    return subcontractors.reduce((total, subcontractor) => {
      return total + calculateSubcontractorMonthlyCost(subcontractor);
    }, 0);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Subcontractors</h3>
          <p className="text-sm text-muted-foreground">
            Add specialized services from subcontractors
          </p>
        </div>
        
        {!isAddingSubcontractor && (
          <Button variant="outline" onClick={() => setIsAddingSubcontractor(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subcontractor
          </Button>
        )}
      </div>
      
      {isAddingSubcontractor ? (
        <Card>
          <CardHeader>
            <CardTitle>Add Subcontractor</CardTitle>
            <CardDescription>
              Add a subcontractor to your quote
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subcontractor Name</Label>
                <Input 
                  id="name" 
                  placeholder="Name of subcontractor"
                  value={newSubcontractor.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Service Provided</Label>
                <Input 
                  id="service" 
                  placeholder="E.g., Window cleaning, Carpet cleaning"
                  value={newSubcontractor.service}
                  onChange={e => handleInputChange('service', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <Input 
                  id="cost" 
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Cost"
                  value={newSubcontractor.cost?.toString()}
                  onChange={e => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={newSubcontractor.frequency as string} 
                  onValueChange={v => handleInputChange('frequency', v)}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="fortnightly">Fortnightly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input 
                id="notes" 
                placeholder="Any additional notes about this subcontractor"
                value={newSubcontractor.notes || ''}
                onChange={e => handleInputChange('notes', e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingSubcontractor(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubcontractor}>
              Add Subcontractor
            </Button>
          </CardFooter>
        </Card>
      ) : (
        subcontractors.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">No Subcontractors Added</h3>
              <p className="text-muted-foreground mb-4">
                Add subcontractors if you need specialized services as part of this quote.
              </p>
              <Button onClick={() => setIsAddingSubcontractor(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Subcontractor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Subcontractors</CardTitle>
              <CardDescription>
                {subcontractors.length} subcontractor{subcontractors.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead className="text-right">Monthly Cost</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subcontractors.map(subcontractor => (
                    <TableRow key={subcontractor.id}>
                      <TableCell className="font-medium">{subcontractor.name}</TableCell>
                      <TableCell>{subcontractor.service}</TableCell>
                      <TableCell>${subcontractor.cost.toFixed(2)}</TableCell>
                      <TableCell>{formatFrequency(subcontractor.frequency)}</TableCell>
                      <TableCell className="text-right">
                        ${calculateSubcontractorMonthlyCost(subcontractor).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSubcontractor(subcontractor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t justify-between">
              <Button variant="outline" onClick={() => setIsAddingSubcontractor(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another
              </Button>
              <div className="text-lg font-medium">
                Total Monthly: ${getTotalMonthlyCost().toFixed(2)}
              </div>
            </CardFooter>
          </Card>
        )
      )}
    </div>
  );
}
