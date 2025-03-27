
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash } from 'lucide-react';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

interface BillingLineItemProps {
  billingLine: BillingLine;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

const BillingLineItem: React.FC<BillingLineItemProps> = ({ billingLine, onUpdate, onRemove }) => {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex-1">
        <Input 
          placeholder="Service description" 
          value={billingLine.description} 
          onChange={(e) => onUpdate(billingLine.id, 'description', e.target.value)}
        />
      </div>
      <div className="w-32">
        <Input 
          type="number"
          placeholder="Amount" 
          value={billingLine.amount} 
          onChange={(e) => onUpdate(billingLine.id, 'amount', parseFloat(e.target.value) || 0)}
          min={0}
          step={0.01}
        />
      </div>
      <div className="w-36">
        <Select 
          value={billingLine.frequency} 
          onValueChange={(value) => onUpdate(billingLine.id, 'frequency', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="fortnightly">Fortnightly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
            <SelectItem value="once">One-time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(billingLine.id)}
        title="Remove this line"
      >
        <Trash className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};

export default BillingLineItem;
