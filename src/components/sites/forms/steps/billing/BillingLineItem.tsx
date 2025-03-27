
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

interface BillingLineItemProps {
  line: BillingLine;
  index: number;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

const BillingLineItem: React.FC<BillingLineItemProps> = ({ line, index, onUpdate, onRemove }) => {
  const handleChange = (field: string, value: any) => {
    onUpdate(line.id, field, value);
  };

  return (
    <div className="p-4 border rounded-md mb-4 bg-muted/20">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Line Item #{index + 1}</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onRemove(line.id)}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`description-${line.id}`}>Description</Label>
          <Input
            id={`description-${line.id}`}
            value={line.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="e.g. Weekly Cleaning Service"
          />
        </div>
        
        <div>
          <Label htmlFor={`amount-${line.id}`}>Amount ($)</Label>
          <Input
            id={`amount-${line.id}`}
            type="number"
            value={line.amount}
            onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
            step="0.01"
          />
        </div>
        
        <div>
          <Label htmlFor={`frequency-${line.id}`}>Frequency</Label>
          <Select 
            value={line.frequency} 
            onValueChange={(val) => handleChange('frequency', val)}
          >
            <SelectTrigger id={`frequency-${line.id}`}>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2 pt-6">
          <Switch 
            id={`recurring-${line.id}`}
            checked={line.isRecurring}
            onCheckedChange={(checked) => handleChange('isRecurring', checked)}
          />
          <Label htmlFor={`recurring-${line.id}`}>Recurring</Label>
          
          <div className="ml-4">
            <Switch 
              id={`onHold-${line.id}`}
              checked={line.onHold}
              onCheckedChange={(checked) => handleChange('onHold', checked)}
            />
            <Label htmlFor={`onHold-${line.id}`}>On Hold</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingLineItem;
