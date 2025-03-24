
import React from 'react';
import { QuoteShift } from '@/lib/award/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock } from 'lucide-react';
import { hasEarlyLateHours } from '@/lib/award/utils';
import { calculateShiftCost } from '@/lib/award/shiftCalculations';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Pre-built shift templates
const SHIFT_TEMPLATES = [
  { 
    name: "Standard 8hr Day", 
    startTime: "09:00", 
    endTime: "17:00", 
    breakDuration: 30,
    description: "Regular 8-hour shift with 30min break" 
  },
  { 
    name: "Early Morning 6hr", 
    startTime: "05:00", 
    endTime: "11:00", 
    breakDuration: 0,
    description: "Early morning 6-hour shift with no break" 
  },
  { 
    name: "Evening 4hr", 
    startTime: "18:00", 
    endTime: "22:00", 
    breakDuration: 0,
    description: "Evening 4-hour shift with no break" 
  },
  { 
    name: "Split Shift", 
    startTime: "06:00", 
    endTime: "10:00", 
    breakDuration: 0,
    description: "Morning portion of a split shift" 
  },
  { 
    name: "Weekend Half Day", 
    startTime: "08:00", 
    endTime: "12:00", 
    breakDuration: 0,
    description: "4-hour weekend morning shift" 
  }
];

// Days of the week
const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday', isWeekend: false },
  { value: 'tuesday', label: 'Tuesday', isWeekend: false },
  { value: 'wednesday', label: 'Wednesday', isWeekend: false },
  { value: 'thursday', label: 'Thursday', isWeekend: false },
  { value: 'friday', label: 'Friday', isWeekend: false },
  { value: 'saturday', label: 'Saturday', isWeekend: true },
  { value: 'sunday', label: 'Sunday', isWeekend: true },
  { value: 'public-holiday', label: 'Public Holiday', isWeekend: false },
];

interface ShiftFormProps {
  newShift: Partial<QuoteShift>;
  onShiftChange: (field: string, value: any) => void;
  onAllowanceToggle: (allowanceId: string) => void;
  onApplyTemplate: (template: typeof SHIFT_TEMPLATES[0]) => void;
  onAddShift: () => void;
  onCancel: () => void;
  allowances: Array<{
    id: string;
    name: string;
    amount: number;
    unit: string;
    description?: string;
  }>;
  isLoadingAllowances: boolean;
}

export function ShiftForm({
  newShift,
  onShiftChange,
  onAllowanceToggle,
  onApplyTemplate,
  onAddShift,
  onCancel,
  allowances,
  isLoadingAllowances
}: ShiftFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Shift</CardTitle>
        <CardDescription>
          Create a new shift and calculate costs based on award rates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Shift templates */}
        <div>
          <h4 className="text-sm font-medium mb-2">Quick Templates</h4>
          <div className="flex flex-wrap gap-2">
            {SHIFT_TEMPLATES.map((template, idx) => (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onApplyTemplate(template)}
                    >
                      {template.name}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="w-60">
                    <p className="text-sm">{template.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.startTime} - {template.endTime} ({template.breakDuration}min break)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="day">Day of Week</Label>
              <Select 
                value={newShift.day} 
                onValueChange={(value) => onShiftChange('day', value)}
              >
                <SelectTrigger id="day">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map(day => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                      {day.isWeekend && <span className="ml-2 text-xs opacity-70">(Weekend)</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newShift.startTime}
                  onChange={(e) => onShiftChange('startTime', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newShift.endTime}
                  onChange={(e) => onShiftChange('endTime', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
              <Input
                id="breakDuration"
                type="number"
                min="0"
                step="5"
                value={newShift.breakDuration}
                onChange={(e) => onShiftChange('breakDuration', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <Label htmlFor="numberOfCleaners">Number of Cleaners</Label>
              <Input
                id="numberOfCleaners"
                type="number"
                min="1"
                value={newShift.numberOfCleaners}
                onChange={(e) => onShiftChange('numberOfCleaners', parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select 
                  value={newShift.employmentType as string} 
                  onValueChange={(value) => onShiftChange('employmentType', value)}
                >
                  <SelectTrigger id="employmentType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="level">Employee Level</Label>
                <Select 
                  value={String(newShift.level)} 
                  onValueChange={(value) => onShiftChange('level', parseInt(value))}
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Applicable Allowances</Label>
              <div className="mt-2 border rounded-md p-3 space-y-2 max-h-[240px] overflow-y-auto">
                {isLoadingAllowances ? (
                  <p className="text-sm text-muted-foreground">Loading allowances...</p>
                ) : allowances.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No allowances available</p>
                ) : (
                  allowances.map(allowance => (
                    <div key={allowance.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`allowance-${allowance.id}`} 
                        checked={(newShift.allowances || []).includes(allowance.id)}
                        onCheckedChange={() => onAllowanceToggle(allowance.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`allowance-${allowance.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {allowance.name}
                          <Badge variant="outline" className="ml-2 font-normal">
                            ${allowance.amount} {allowance.unit}
                          </Badge>
                        </label>
                        {allowance.description && (
                          <p className="text-xs text-muted-foreground">
                            {allowance.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location/Area (Optional)</Label>
              <Input
                id="location"
                value={newShift.location || ''}
                onChange={(e) => onShiftChange('location', e.target.value)}
                placeholder="e.g., Floor 3, Kitchen area"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={newShift.notes || ''}
                onChange={(e) => onShiftChange('notes', e.target.value)}
                placeholder="Any special instructions for this shift"
              />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Estimated Shift Cost:</span>
                <span className="text-lg font-bold">
                  ${calculateShiftCost(newShift).toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Based on award rates and selected allowances
              </div>
            </div>
          </div>
        </div>
        
        {/* Penalty rate information */}
        {hasEarlyLateHours(newShift.startTime || '08:00', newShift.endTime || '16:00') && (
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200 text-blue-800 text-sm">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <span className="font-medium">Early/Late Shift Penalty Applied</span>
                <p className="text-xs mt-1 text-blue-700">
                  This shift includes hours outside of 6:00 AM - 6:00 PM, triggering penalty rates.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onAddShift}>
          Add Shift
        </Button>
      </CardFooter>
    </Card>
  );
}
