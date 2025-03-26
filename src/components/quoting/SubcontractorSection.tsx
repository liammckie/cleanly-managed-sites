
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, DollarSign, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Frequency, Subcontractor } from '@/lib/award/types';

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export interface SubcontractorSectionProps {
  subcontractors: Subcontractor[];
  onSubcontractorsChange: (newSubcontractors: Subcontractor[]) => void;
}

export function SubcontractorSection({ 
  subcontractors = [], 
  onSubcontractorsChange 
}: SubcontractorSectionProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentSubcontractor, setCurrentSubcontractor] = useState<Partial<Subcontractor>>({
    id: '',
    name: '',
    description: '',
    cost: 0,
    frequency: 'monthly',
    services: [],
  });

  const handleInputChange = (field: keyof Subcontractor, value: any) => {
    setCurrentSubcontractor(prev => ({
      ...prev,
      [field]: field === 'cost' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddSubcontractor = () => {
    const newId = editMode ? currentSubcontractor.id : uuidv4();
    const newSubcontractor: Subcontractor = {
      ...currentSubcontractor as any,
      id: newId as string,
      quoteId: '' // Add empty quoteId to satisfy type requirements
    };

    if (editMode) {
      onSubcontractorsChange(
        subcontractors.map(s => s.id === newSubcontractor.id ? newSubcontractor : s)
      );
      setEditMode(false);
    } else {
      onSubcontractorsChange([...subcontractors, newSubcontractor]);
    }

    // Reset the form
    setCurrentSubcontractor({
      id: '',
      name: '',
      description: '',
      cost: 0,
      frequency: 'monthly',
      services: [],
    });
  };

  const handleEditSubcontractor = (subcontractor: Subcontractor) => {
    setCurrentSubcontractor({...subcontractor});
    setEditMode(true);
  };

  const handleDeleteSubcontractor = (id: string) => {
    onSubcontractorsChange(subcontractors.filter(s => s.id !== id));
  };

  const calculateMonthlyCost = (subcontractor: Subcontractor): number => {
    if (!subcontractor.cost) return 0;
    
    switch (subcontractor.frequency) {
      case 'daily':
        return subcontractor.cost * 22; // Approx. working days in a month
      case 'weekly':
        return subcontractor.cost * 4.33; // Average weeks in a month
      case 'fortnightly':
        return subcontractor.cost * 2.17; // Fortnightly in a month
      case 'monthly':
        return subcontractor.cost;
      case 'quarterly':
        return subcontractor.cost / 3;
      case 'annually':
        return subcontractor.cost / 12;
      case 'one_time':
        return subcontractor.cost;
      default:
        return subcontractor.cost;
    }
  };

  const totalMonthlyCost = subcontractors.reduce(
    (total, subcontractor) => total + calculateMonthlyCost(subcontractor),
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subcontractors and Additional Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="name">Name/Company</Label>
              <Input
                id="name"
                placeholder="Enter service provider name"
                value={currentSubcontractor.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Service description"
                value={currentSubcontractor.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={currentSubcontractor.frequency as string}
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
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="one_time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cost">
                <div className="flex items-center">
                  Cost <DollarSign className="h-3.5 w-3.5 ml-1" />
                </div>
              </Label>
              <Input
                id="cost"
                type="number"
                placeholder="0.00"
                value={currentSubcontractor.cost || ''}
                onChange={(e) => handleInputChange('cost', e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex items-end">
              <Button 
                onClick={handleAddSubcontractor} 
                className="gap-2"
                disabled={!currentSubcontractor.name || !currentSubcontractor.cost}
              >
                {editMode ? 'Update' : 'Add'} <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {subcontractors.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <AlertCircle className="mx-auto h-10 w-10 opacity-20 mb-2" />
              <p>No subcontractors or services added yet</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Monthly Cost</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subcontractors.map((subcontractor) => (
                    <TableRow key={subcontractor.id}>
                      <TableCell>{subcontractor.name}</TableCell>
                      <TableCell>{subcontractor.description}</TableCell>
                      <TableCell className="capitalize">
                        {subcontractor.frequency === 'one_time' 
                          ? 'One-time' 
                          : subcontractor.frequency}
                      </TableCell>
                      <TableCell>{formatCurrency(subcontractor.cost)}</TableCell>
                      <TableCell>
                        {subcontractor.frequency === 'one_time'
                          ? '—'
                          : formatCurrency(calculateMonthlyCost(subcontractor))}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditSubcontractor(subcontractor)}
                          >
                            <span className="sr-only">Edit</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSubcontractor(subcontractor.id)}
                          >
                            <span className="sr-only">Delete</span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end mt-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Monthly Total</div>
                  <div className="text-xl font-semibold">{formatCurrency(totalMonthlyCost)}</div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
