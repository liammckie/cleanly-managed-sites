
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { QuoteSubcontractor } from '@/types/models';
import { Frequency } from '@/types/common';

interface SubcontractorSectionProps {
  subcontractors: QuoteSubcontractor[];
  onAddSubcontractor: (subcontractor: Partial<QuoteSubcontractor>) => void;
  onRemoveSubcontractor: (subcontractorId: string) => void;
}

export function SubcontractorSection({ 
  subcontractors, 
  onAddSubcontractor, 
  onRemoveSubcontractor 
}: SubcontractorSectionProps) {
  const [name, setName] = useState('');
  const [service, setService] = useState('');
  const [cost, setCost] = useState<number>(0);
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [notes, setNotes] = useState('');
  
  const handleAddSubcontractor = () => {
    if (!name) return;
    
    onAddSubcontractor({
      name,
      service,
      cost,
      frequency,
      notes
    });
    
    // Reset form
    setName('');
    setService('');
    setCost(0);
    setFrequency('monthly');
    setNotes('');
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subcontractors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {subcontractors.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Service</th>
                    <th className="px-4 py-2 text-left">Frequency</th>
                    <th className="px-4 py-2 text-left">Cost</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subcontractors.map(sub => (
                    <tr key={sub.id} className="border-b">
                      <td className="px-4 py-2">{sub.name}</td>
                      <td className="px-4 py-2">{sub.service || 'General'}</td>
                      <td className="px-4 py-2">
                        {sub.frequency.charAt(0).toUpperCase() + sub.frequency.slice(1)}
                      </td>
                      <td className="px-4 py-2">{formatCurrency(sub.cost)}</td>
                      <td className="px-4 py-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => onRemoveSubcontractor(sub.id)}
                          aria-label="Remove subcontractor"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="p-4 border rounded-md space-y-4">
            <h3 className="text-lg font-medium">Add Subcontractor</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Subcontractor name" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Service Type</label>
                <Input value={service} onChange={e => setService(e.target.value)} placeholder="Service provided" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cost</label>
                <Input 
                  type="number" 
                  value={cost} 
                  onChange={e => setCost(Number(e.target.value))} 
                  min={0} 
                  step={10}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <Select value={frequency} onValueChange={value => setFrequency(value as Frequency)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="fortnightly">Fortnightly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="once">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes (optional)</label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." />
            </div>
            
            <Button onClick={handleAddSubcontractor} disabled={!name}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subcontractor
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
