import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { QuoteSubcontractor } from '@/types/models';
import { SubcontractorSectionProps } from './types';
import { Frequency } from '@/types/common';

export const SubcontractorSection: React.FC<SubcontractorSectionProps> = ({ 
  subcontractors = [],
  onAddSubcontractor,
  onRemoveSubcontractor,
  onSubcontractorsChange
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<QuoteSubcontractor>>({
    name: '',
    description: '',
    service: '',
    cost: 0,
    frequency: 'monthly' as Frequency,
    isFlatRate: true
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onAddSubcontractor) {
      onAddSubcontractor(formData);
    } else if (onSubcontractorsChange) {
      const newSubcontractor: QuoteSubcontractor = {
        id: uuidv4(),
        quote_id: '',
        name: formData.name || '',
        description: formData.description || '',
        service: formData.service || '',
        cost: formData.cost || 0,
        frequency: formData.frequency || 'monthly',
        isFlatRate: formData.isFlatRate ?? true,
        email: formData.email || '',
        phone: formData.phone || '',
        notes: formData.notes || '',
        services: formData.services || [],
        customServices: formData.customServices || '',
        monthlyCost: formData.monthlyCost || 0
      };
      
      onSubcontractorsChange([...subcontractors, newSubcontractor]);
    }
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      service: '',
      cost: 0,
      frequency: 'monthly' as Frequency,
      isFlatRate: true
    });
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    if (onRemoveSubcontractor) {
      onRemoveSubcontractor(id);
    } else if (onSubcontractorsChange) {
      onSubcontractorsChange(subcontractors.filter(s => s.id !== id));
    }
  };

  const calculateMonthlyValue = (cost: number, frequency: string) => {
    switch (frequency) {
      case 'daily':
        return cost * 30; // Approximate
      case 'weekly':
        return cost * 4.33; // Approximate weeks per month
      case 'fortnightly':
        return cost * 2.17; // Approximate fortnights per month
      case 'monthly':
        return cost;
      case 'quarterly':
        return cost / 3;
      case 'yearly':
        return cost / 12;
      case 'once':
        return cost / 12; // Spread over one year as an approximation
      default:
        return cost;
    }
  };

  const totalMonthlyCost = subcontractors.reduce((sum, sub) => {
    return sum + calculateMonthlyValue(sub.cost, sub.frequency as string);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Subcontractors & External Services</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Subcontractor
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Subcontractor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name/Company</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Input 
                    id="service"
                    value={formData.service}
                    onChange={(e) => handleChange('service', e.target.value)}
                    placeholder="e.g. Window Cleaning"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input 
                    id="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select 
                    value={formData.frequency as string} 
                    onValueChange={(value) => handleChange('frequency', value)}
                  >
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
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Brief description of services provided"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="isFlatRate" 
                  checked={formData.isFlatRate}
                  onCheckedChange={(checked) => handleChange('isFlatRate', checked)}
                />
                <Label htmlFor="isFlatRate">Flat Rate (vs. Hourly/Variable)</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Subcontractor
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {subcontractors.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-muted/30">
          <p className="text-muted-foreground">No subcontractors added to this quote.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add subcontractors or external services that will be part of this quote.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {subcontractors.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{sub.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {sub.service || 'General Service'} - {sub.frequency.charAt(0).toUpperCase() + sub.frequency.slice(1)}
                    </p>
                    {sub.description && (
                      <p className="text-sm mt-2">{sub.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${sub.cost.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${calculateMonthlyValue(sub.cost, sub.frequency as string).toFixed(2)}/month
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 h-7 text-destructive hover:text-destructive"
                      onClick={() => handleRemove(sub.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="mt-4 p-4 border rounded-md bg-muted/30">
            <div className="flex justify-between items-center">
              <p className="font-medium">Total Monthly Cost:</p>
              <p className="font-bold">${totalMonthlyCost.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-muted-foreground">Annual Cost:</p>
              <p className="text-sm font-medium">${(totalMonthlyCost * 12).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
