
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, PauseCircle, PlayCircle, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BillingLine, BillingFrequency } from './types/billingTypes';
import { calculateBillingAmounts } from '@/lib/utils/billingCalculations';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface BillingLineItemProps {
  line: BillingLine;
  index: number;
  updateLine: (index: number, field: keyof BillingLine, value: any) => void;
  removeLine: (index: number) => void;
  isFirst: boolean;
}

export function BillingLineItem({
  line,
  index,
  updateLine,
  removeLine,
  isFirst,
}: BillingLineItemProps) {
  // Recalculate and update amounts when amount or frequency changes
  useEffect(() => {
    if (line.amount) {
      const { weeklyAmount, monthlyAmount, annualAmount } = calculateBillingAmounts(
        line.amount,
        line.frequency as BillingFrequency
      );
      updateLine(index, 'weeklyAmount', weeklyAmount);
      updateLine(index, 'monthlyAmount', monthlyAmount);
      updateLine(index, 'annualAmount', annualAmount);
    }
  }, [line.amount, line.frequency, index, updateLine]);

  const frequencyOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "fortnightly", label: "Fortnightly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annually", label: "Annually" },
  ];

  // Toggle billing hold
  const toggleHold = () => {
    // If turning on hold, set the start date to today
    if (!line.onHold) {
      updateLine(index, 'onHold', true);
      updateLine(index, 'holdStartDate', format(new Date(), 'yyyy-MM-dd'));
    } else {
      updateLine(index, 'onHold', false);
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  return (
    <Card key={line.id || index} className={`p-4 border relative ${line.onHold ? 'bg-gray-50' : ''}`}>
      {line.onHold && (
        <div className="absolute top-0 left-0 w-full bg-yellow-100 text-yellow-800 px-4 py-1 text-sm flex items-center">
          <PauseCircle size={14} className="mr-1" />
          <span>
            On Hold
            {line.holdStartDate && ` since ${formatDate(line.holdStartDate)}`}
            {line.holdEndDate && ` until ${formatDate(line.holdEndDate)}`}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor={`line-${index}-description`}>Description</Label>
          <Input
            id={`line-${index}-description`}
            placeholder="Line item description"
            value={line.description}
            onChange={(e) => updateLine(index, 'description', e.target.value)}
            className="glass-input"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`line-${index}-amount`}>Amount</Label>
          <Input
            id={`line-${index}-amount`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={line.amount}
            onChange={(e) => updateLine(index, 'amount', parseFloat(e.target.value))}
            className="glass-input"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor={`line-${index}-frequency`}>Frequency</Label>
          <select
            id={`line-${index}-frequency`}
            className="w-full border border-gray-300 rounded-md px-3 py-2 glass-input"
            value={line.frequency}
            onChange={(e) => updateLine(index, 'frequency', e.target.value)}
          >
            {frequencyOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2 mt-6">
          <Checkbox 
            id={`line-${index}-recurring`} 
            checked={line.isRecurring}
            onCheckedChange={(checked) => updateLine(index, 'isRecurring', !!checked)}
          />
          <label
            htmlFor={`line-${index}-recurring`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Recurring Charge
          </label>
        </div>
      </div>

      {/* Show calculated amounts */}
      <div className="grid grid-cols-3 gap-4 mb-4 bg-gray-50 p-2 rounded">
        <div className="text-sm">
          <span className="text-muted-foreground mr-2">Weekly:</span>
          <span className="font-medium">{formatCurrency(line.weeklyAmount, 'AUD')}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground mr-2">Monthly:</span>
          <span className="font-medium">{formatCurrency(line.monthlyAmount, 'AUD')}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground mr-2">Annual:</span>
          <span className="font-medium">{formatCurrency(line.annualAmount, 'AUD')}</span>
        </div>
      </div>
      
      {/* Display credit information if applicable */}
      {line.creditAmount && line.creditAmount > 0 && (
        <div className="mt-2 p-2 bg-green-50 rounded text-sm">
          <span className="text-green-700 font-medium">
            Credit applied: {formatCurrency(line.creditAmount, 'AUD')} 
            {line.creditDate && ` on ${formatDate(line.creditDate)}`}
          </span>
          {line.creditReason && (
            <p className="text-green-600 mt-1">{line.creditReason}</p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 mt-2">
        {/* Hold button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={line.onHold ? "text-green-600" : "text-yellow-600"}
            >
              {line.onHold ? (
                <>
                  <PlayCircle size={16} className="mr-1" />
                  Resume Billing
                </>
              ) : (
                <>
                  <PauseCircle size={16} className="mr-1" />
                  Hold Billing
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">
                {line.onHold ? "Resume Billing" : "Place Billing On Hold"}
              </h4>

              {!line.onHold ? (
                <>
                  <div className="space-y-2">
                    <Label>Hold Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          {line.holdStartDate ? formatDate(line.holdStartDate) : "Select start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={line.holdStartDate ? new Date(line.holdStartDate) : undefined}
                          onSelect={(date) => updateLine(index, 'holdStartDate', date ? format(date, 'yyyy-MM-dd') : undefined)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Hold End Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          {line.holdEndDate ? formatDate(line.holdEndDate) : "Select end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={line.holdEndDate ? new Date(line.holdEndDate) : undefined}
                          onSelect={(date) => updateLine(index, 'holdEndDate', date ? format(date, 'yyyy-MM-dd') : undefined)}
                          initialFocus
                          disabled={(date) => {
                            if (!line.holdStartDate) return false;
                            return date < new Date(line.holdStartDate);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => toggleHold()}>
                  {line.onHold ? "Resume Billing" : "Place On Hold"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Credit button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-green-600">
              <CreditCard size={16} className="mr-1" />
              Apply Credit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Apply Credit</DialogTitle>
              <DialogDescription>
                Apply a credit to this billing line.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="credit-amount">Credit Amount</Label>
                <Input
                  id="credit-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter credit amount"
                  value={line.creditAmount || ''}
                  onChange={(e) => updateLine(index, 'creditAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Credit Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      {line.creditDate ? formatDate(line.creditDate) : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={line.creditDate ? new Date(line.creditDate) : undefined}
                      onSelect={(date) => updateLine(index, 'creditDate', date ? format(date, 'yyyy-MM-dd') : undefined)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="credit-reason">Reason for Credit</Label>
                <Textarea
                  id="credit-reason"
                  placeholder="Enter reason for credit"
                  value={line.creditReason || ''}
                  onChange={(e) => updateLine(index, 'creditReason', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Apply Credit</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete button - only visible if not the first line */}
        {!isFirst && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeLine(index)}
            className="h-8 w-8 p-0 text-destructive"
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </Card>
  );
}
