
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateBillingAmounts } from '@/lib/utils/billingCalculations';
import { BillingLine } from './types/billingTypes';

interface BillingLineItemProps {
  line: BillingLine;
  updateLine: (id: string, field: string, value: any) => void;
  removeLine: (id: string) => void;
  isFirst?: boolean;
}

export const BillingLineItem: React.FC<BillingLineItemProps> = ({
  line,
  updateLine,
  removeLine,
  isFirst = false
}) => {
  // Calculate derived amounts when amount or frequency changes
  useEffect(() => {
    if (line.amount !== undefined && line.frequency) {
      const { weeklyAmount, monthlyAmount, annualAmount } = calculateBillingAmounts(
        line.amount,
        line.frequency
      );
      
      // Only update if values have changed
      if (line.weeklyAmount !== weeklyAmount) {
        updateLine(line.id, 'weeklyAmount', weeklyAmount);
      }
      
      if (line.monthlyAmount !== monthlyAmount) {
        updateLine(line.id, 'monthlyAmount', monthlyAmount);
      }
      
      if (line.annualAmount !== annualAmount) {
        updateLine(line.id, 'annualAmount', annualAmount);
      }
    }
  }, [line.amount, line.frequency, line.id, updateLine]);

  return (
    <div className="grid grid-cols-12 gap-4 items-start mb-4 p-3 bg-slate-50 rounded-md border border-slate-200">
      <div className="col-span-12 md:col-span-5">
        <Label htmlFor={`description-${line.id}`} className="text-xs mb-1 block">
          Description
        </Label>
        <Input
          id={`description-${line.id}`}
          value={line.description}
          onChange={(e) => updateLine(line.id, 'description', e.target.value)}
          placeholder="Service description"
        />
      </div>
      
      <div className="col-span-4 md:col-span-2">
        <Label htmlFor={`amount-${line.id}`} className="text-xs mb-1 block">
          Amount
        </Label>
        <Input
          id={`amount-${line.id}`}
          type="number"
          value={line.amount === 0 ? '' : line.amount}
          onChange={(e) => updateLine(line.id, 'amount', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
        />
      </div>
      
      <div className="col-span-8 md:col-span-3">
        <Label htmlFor={`frequency-${line.id}`} className="text-xs mb-1 block">
          Frequency
        </Label>
        <Select
          value={line.frequency}
          onValueChange={(value) => updateLine(line.id, 'frequency', value)}
        >
          <SelectTrigger id={`frequency-${line.id}`}>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="fortnightly">Fortnightly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
            <SelectItem value="one-time">One-time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-9 md:col-span-1 flex items-end justify-start">
        <div className="flex items-center space-x-2 mt-6">
          <Switch
            id={`recurring-${line.id}`}
            checked={line.isRecurring}
            onCheckedChange={(checked) => {
              updateLine(line.id, 'isRecurring', checked);
            }}
          />
          <Label htmlFor={`recurring-${line.id}`} className="text-xs">
            Recurring
          </Label>
        </div>
      </div>
      
      <div className="col-span-3 md:col-span-1 flex items-end justify-end">
        {!isFirst && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeLine(line.id)}
            className="h-9 w-9 mt-6"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default BillingLineItem;
