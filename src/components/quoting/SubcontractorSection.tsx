
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Edit, Plus, Trash2 } from 'lucide-react';
import { Subcontractor, FrequencyType } from '@/lib/award/types';
import { formatCurrency } from '@/lib/award/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SubcontractorSectionProps {
  subcontractors: Subcontractor[];
  onSubcontractorsChange: (subcontractors: Subcontractor[]) => void;
}

export function SubcontractorSection({ subcontractors, onSubcontractorsChange }: SubcontractorSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('monthly');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  
  const resetForm = () => {
    setName('');
    setService('');
    setDescription('');
    setFrequency('monthly');
    setCost('');
    setNotes('');
    setEditingId(null);
  };
  
  const handleAdd = () => {
    setIsDialogOpen(true);
  };
  
  const handleEdit = (id: string) => {
    const subcontractor = subcontractors.find(s => s.id === id);
    if (subcontractor) {
      setName(subcontractor.name);
      setService(subcontractor.service || '');
      setDescription(subcontractor.description || '');
      setFrequency(subcontractor.frequency);
      setCost(subcontractor.cost.toString());
      setNotes(subcontractor.notes || '');
      setEditingId(id);
      setIsDialogOpen(true);
    }
  };
  
  const handleDelete = (id: string) => {
    onSubcontractorsChange(subcontractors.filter(s => s.id !== id));
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleSave = () => {
    if (!name.trim() || !cost.trim()) {
      return; // Basic validation
    }
    
    const costValue = parseFloat(cost);
    
    if (isNaN(costValue) || costValue < 0) {
      return;
    }
    
    if (editingId) {
      // Update existing
      onSubcontractorsChange(
        subcontractors.map(s => 
          s.id === editingId 
            ? {
                ...s,
                name,
                service,
                description,
                frequency,
                cost: costValue,
                notes,
                updatedAt: new Date().toISOString()
              }
            : s
        )
      );
    } else {
      // Add new
      const newSubcontractor: Subcontractor = {
        id: uuidv4(),
        quoteId: '',
        name,
        service,
        description,
        frequency,
        cost: costValue,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      onSubcontractorsChange([...subcontractors, newSubcontractor]);
    }
    
    handleDialogClose();
  };
  
  const calculateMonthlyEstimate = (sub: Subcontractor): number => {
    switch (sub.frequency) {
      case 'daily':
        return sub.cost * 30; // Approx days per month
      case 'weekly':
        return sub.cost * 4.33; // Weeks per month
      case 'fortnightly':
        return sub.cost * 2.17; // Fortnightly occurrences per month
      case 'monthly':
        return sub.cost;
      case 'quarterly':
        return sub.cost / 3;
      case 'annually':
        return sub.cost / 12;
      case 'one_time':
        return sub.cost / 12; // Spread over a year by default
      default:
        return sub.cost;
    }
  };
  
  const totalMonthly = subcontractors.reduce((total, sub) => total + calculateMonthlyEstimate(sub), 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Subcontractors & Services</h3>
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Subcontractor
        </Button>
      </div>
      
      {subcontractors.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Subcontractors Added</AlertTitle>
          <AlertDescription>
            Add subcontractors or specialized services that will be included in this quote.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Subcontractors</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Monthly Est.</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subcontractors.map(sub => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell>{sub.service}</TableCell>
                    <TableCell>
                      {sub.frequency === 'one_time' ? 'One-time' : 
                       sub.frequency === 'annually' ? 'Yearly' : 
                       sub.frequency.charAt(0).toUpperCase() + sub.frequency.slice(1)}
                    </TableCell>
                    <TableCell>{formatCurrency(sub.cost)}</TableCell>
                    <TableCell>{formatCurrency(calculateMonthlyEstimate(sub))}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(sub.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(sub.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-medium">
                    Total Monthly Cost:
                  </TableCell>
                  <TableCell className="font-bold">{formatCurrency(totalMonthly)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[485px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Subcontractor' : 'Add Subcontractor'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Subcontractor name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Service
              </Label>
              <Input
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="col-span-3"
                placeholder="Service provided"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frequency
              </Label>
              <Select
                value={frequency}
                onValueChange={(value) => setFrequency(value as FrequencyType)}
              >
                <SelectTrigger className="col-span-3">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
                Cost
              </Label>
              <Input
                id="cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="col-span-3"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right align-top mt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Optional description"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right align-top mt-2">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3"
                placeholder="Any additional notes"
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingId ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
