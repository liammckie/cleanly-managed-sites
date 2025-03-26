
import React from 'react';
import { QuoteShift } from '@/lib/types/award/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { TimePicker } from '@/components/ui/time-picker';

export interface ShiftFormProps {
  shift: Partial<QuoteShift>;
  onShiftChange: (field: string, value: any) => void;
  onAllowanceToggle: (allowanceId: string) => void;
  onAddShift: () => void;
  onCancel: () => void;
  allowances: Array<{ id: string; name: string; description?: string }>;
  isLoadingAllowances: boolean;
}

export function ShiftForm({ 
  shift, 
  onShiftChange, 
  onAllowanceToggle,
  onAddShift,
  onCancel,
  allowances,
  isLoadingAllowances
}: ShiftFormProps) {
  
  // Day options
  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];
  
  // Employment type options
  const employmentOptions = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'casual', label: 'Casual' }
  ];
  
  // Level options
  const levelOptions = [
    { value: 1, label: 'Level 1' },
    { value: 2, label: 'Level 2' },
    { value: 3, label: 'Level 3' },
    { value: 4, label: 'Level 4' },
    { value: 5, label: 'Level 5' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Shift</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="day">Day</Label>
            <Select 
              value={shift.day || 'monday'} 
              onValueChange={(value) => onShiftChange('day', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {dayOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={shift.location || ''}
              onChange={(e) => onShiftChange('location', e.target.value)}
              placeholder="e.g., Main Building, Floor 3"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={shift.startTime || '09:00'}
              onChange={(e) => onShiftChange('startTime', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={shift.endTime || '17:00'}
              onChange={(e) => onShiftChange('endTime', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="breakDuration">Break (minutes)</Label>
            <Input
              id="breakDuration"
              type="number"
              min={0}
              value={shift.breakDuration || 30}
              onChange={(e) => onShiftChange('breakDuration', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employmentType">Employment Type</Label>
            <Select 
              value={shift.employmentType || 'full_time'} 
              onValueChange={(value) => onShiftChange('employmentType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                {employmentOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select 
              value={shift.level?.toString() || '1'} 
              onValueChange={(value) => onShiftChange('level', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map(option => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numberOfCleaners">Number of Cleaners</Label>
            <Input
              id="numberOfCleaners"
              type="number"
              min={1}
              value={shift.numberOfCleaners || 1}
              onChange={(e) => onShiftChange('numberOfCleaners', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Allowances</Label>
          
          {isLoadingAllowances ? (
            <div className="text-sm text-muted-foreground">Loading allowances...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {allowances.map(allowance => (
                <div key={allowance.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`allowance-${allowance.id}`}
                    checked={(shift.allowances || []).includes(allowance.id)}
                    onCheckedChange={() => onAllowanceToggle(allowance.id)}
                  />
                  <div>
                    <Label 
                      htmlFor={`allowance-${allowance.id}`}
                      className="text-sm font-medium"
                    >
                      {allowance.name}
                    </Label>
                    {allowance.description && (
                      <p className="text-xs text-muted-foreground">{allowance.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={shift.notes || ''}
            onChange={(e) => onShiftChange('notes', e.target.value)}
            placeholder="Any special instructions or notes about this shift"
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onAddShift}>Add Shift</Button>
      </CardFooter>
    </Card>
  );
}
