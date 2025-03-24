
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Plus, Trash2, Edit, Wrench } from 'lucide-react';
import { Subcontractor } from '@/lib/award/types';

interface SubcontractorSectionProps {
  subcontractors: Subcontractor[];
  onSubcontractorsChange: (subcontractors: Subcontractor[]) => void;
}

export function SubcontractorSection({ 
  subcontractors, 
  onSubcontractorsChange 
}: SubcontractorSectionProps) {
  const [newSubcontractor, setNewSubcontractor] = useState<Omit<Subcontractor, 'id'>>({
    name: '',
    service: '',
    cost: 0,
    frequency: 'weekly',
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const resetForm = () => {
    setNewSubcontractor({
      name: '',
      service: '',
      cost: 0,
      frequency: 'weekly',
      notes: ''
    });
    setIsEditing(false);
    setEditIndex(null);
  };
  
  const handleInputChange = (field: keyof Omit<Subcontractor, 'id'>, value: any) => {
    setNewSubcontractor(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddSubcontractor = () => {
    if (isEditing && editIndex !== null) {
      // Update existing subcontractor
      const updatedSubcontractors = [...subcontractors];
      updatedSubcontractors[editIndex] = { 
        ...newSubcontractor, 
        id: subcontractors[editIndex].id 
      };
      onSubcontractorsChange(updatedSubcontractors);
    } else {
      // Add new subcontractor
      const newSubcontractorWithId: Subcontractor = {
        ...newSubcontractor,
        id: Math.random().toString(36).substring(2, 11)
      };
      onSubcontractorsChange([...subcontractors, newSubcontractorWithId]);
    }
    
    resetForm();
    setDialogOpen(false);
  };
  
  const handleEditSubcontractor = (index: number) => {
    const subcontractor = subcontractors[index];
    setNewSubcontractor({
      name: subcontractor.name,
      service: subcontractor.service,
      cost: subcontractor.cost,
      frequency: subcontractor.frequency,
      notes: subcontractor.notes || ''
    });
    setIsEditing(true);
    setEditIndex(index);
    setDialogOpen(true);
  };
  
  const handleDeleteSubcontractor = (index: number) => {
    const updatedSubcontractors = [...subcontractors];
    updatedSubcontractors.splice(index, 1);
    onSubcontractorsChange(updatedSubcontractors);
  };
  
  const getTotalCost = (frequency: string, cost: number): { weekly: number, monthly: number, yearly: number } => {
    let weekly = 0;
    
    switch (frequency) {
      case 'daily':
        weekly = cost * 7;
        break;
      case 'weekly':
        weekly = cost;
        break;
      case 'fortnightly':
        weekly = cost / 2;
        break;
      case 'monthly':
        weekly = cost / 4.33;
        break;
    }
    
    return {
      weekly,
      monthly: weekly * 4.33,
      yearly: weekly * 52
    };
  };
  
  // Calculate total costs
  const totalWeeklyCost = subcontractors.reduce((sum, sub) => {
    const costs = getTotalCost(sub.frequency, sub.cost);
    return sum + costs.weekly;
  }, 0);
  
  const totalMonthlyCost = subcontractors.reduce((sum, sub) => {
    const costs = getTotalCost(sub.frequency, sub.cost);
    return sum + costs.monthly;
  }, 0);
  
  const totalYearlyCost = subcontractors.reduce((sum, sub) => {
    const costs = getTotalCost(sub.frequency, sub.cost);
    return sum + costs.yearly;
  }, 0);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Subcontractors</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subcontractor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Subcontractor' : 'Add Subcontractor'}
              </DialogTitle>
              <DialogDescription>
                Add specialized services provided by a subcontractor
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Subcontractor Name</Label>
                  <Input
                    id="name"
                    value={newSubcontractor.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Company or individual name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service">Service Provided</Label>
                  <Input
                    id="service"
                    value={newSubcontractor.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    placeholder="e.g., Window cleaning, Carpet cleaning"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    min={0}
                    step={0.01}
                    value={newSubcontractor.cost}
                    onChange={(e) => handleInputChange('cost', parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={newSubcontractor.frequency}
                    onValueChange={(value) => handleInputChange('frequency', value)}
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
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newSubcontractor.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional details or requirements"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddSubcontractor}
                disabled={!newSubcontractor.name || !newSubcontractor.service || newSubcontractor.cost <= 0}
              >
                {isEditing ? 'Update' : 'Add'} Subcontractor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {subcontractors.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Subcontractors Added</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Add subcontractors for specialized services like high-rise window cleaning or carpet treatment.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Subcontractor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcontractors.map((subcontractor, index) => (
                <TableRow key={subcontractor.id}>
                  <TableCell className="font-medium">{subcontractor.name}</TableCell>
                  <TableCell>{subcontractor.service}</TableCell>
                  <TableCell>${subcontractor.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    {subcontractor.frequency.charAt(0).toUpperCase() + subcontractor.frequency.slice(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditSubcontractor(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteSubcontractor(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Cost</p>
                <p className="text-lg font-semibold">${totalWeeklyCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Cost</p>
                <p className="text-lg font-semibold">${totalMonthlyCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Cost</p>
                <p className="text-lg font-semibold">${totalYearlyCost.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
