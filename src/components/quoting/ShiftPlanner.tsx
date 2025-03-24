
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { QuoteShift, EmploymentType, EmployeeLevel, AllowanceType } from '@/lib/award/types';
import { calculateJobCost, getAwardRates } from '@/lib/award/awardEngine';
import { useAllowances } from '@/hooks/useQuotes';
import { toast } from 'sonner';
import { Plus, Trash2, Copy, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

// Function to calculate time difference in hours
const calculateHourDifference = (startTime: string, endTime: string, breakDuration: number): number => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  // If end time is earlier than start time, add 1 day to end time (overnight shift)
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  // Subtract break duration (convert minutes to hours)
  return diffHours - (breakDuration / 60);
};

// Function to determine if a shift spans early/late hours (before 6am or after 6pm)
const hasEarlyLateHours = (startTime: string, endTime: string): boolean => {
  const earlyStartHour = 6; // 6am
  const lateEndHour = 18; // 6pm
  
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  // If end time is earlier than start time, add 1 day to end time (overnight shift)
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  const startHour = start.getHours();
  const endHour = end.getHours();
  
  return startHour < earlyStartHour || endHour >= lateEndHour;
};

// Function to calculate overtime hours
const calculateOvertimeHours = (shifts: QuoteShift[]): Record<string, number> => {
  // Group shifts by employment type + level (employee profile)
  const employeeShifts: Record<string, number> = {};
  
  shifts.forEach(shift => {
    const employeeKey = `${shift.employmentType}-${shift.level}-${shift.numberOfCleaners}`;
    const shiftHours = calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration);
    
    if (!employeeShifts[employeeKey]) {
      employeeShifts[employeeKey] = 0;
    }
    
    employeeShifts[employeeKey] += shiftHours;
  });
  
  // Calculate overtime hours
  const overtimeHours: Record<string, number> = {};
  
  Object.entries(employeeShifts).forEach(([employeeKey, totalHours]) => {
    if (totalHours > 38) {
      overtimeHours[employeeKey] = totalHours - 38;
    }
  });
  
  return overtimeHours;
};

interface ShiftPlannerProps {
  quoteId: string | null;
  shifts: QuoteShift[];
  onShiftsChange: (shifts: QuoteShift[]) => void;
}

export function ShiftPlanner({ quoteId, shifts, onShiftsChange }: ShiftPlannerProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [shiftBeingEdited, setShiftBeingEdited] = useState<QuoteShift | null>(null);
  const [newShift, setNewShift] = useState<Partial<QuoteShift>>({
    day: 'monday',
    startTime: '08:00',
    endTime: '16:00',
    breakDuration: 30,
    numberOfCleaners: 1,
    employmentType: 'full-time',
    level: 1,
    allowances: [],
    estimatedCost: 0,
    location: '',
    notes: ''
  });
  
  const { data: allowances = [], isLoading: isLoadingAllowances } = useAllowances();
  
  // Calculate overtime warnings
  const overtimeHours = calculateOvertimeHours(shifts);
  const hasOvertimeWarnings = Object.keys(overtimeHours).length > 0;
  
  // Calculate total estimated cost
  const totalEstimatedCost = shifts.reduce((total, shift) => total + shift.estimatedCost, 0);
  
  const handleShiftChange = (field: string, value: any) => {
    setNewShift(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAllowanceToggle = (allowanceId: string) => {
    setNewShift(prev => {
      const currentAllowances = prev.allowances || [];
      if (currentAllowances.includes(allowanceId)) {
        return { ...prev, allowances: currentAllowances.filter(id => id !== allowanceId) };
      } else {
        return { ...prev, allowances: [...currentAllowances, allowanceId] };
      }
    });
  };
  
  const calculateShiftCost = (shift: Partial<QuoteShift>): number => {
    if (!shift.startTime || !shift.endTime || !shift.employmentType || !shift.level || !shift.day) {
      return 0;
    }
    
    const hours = calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration || 0);
    if (hours <= 0) return 0;
    
    // Get base rates for the employment type and level
    const rateInfo = getAwardRates(
      shift.employmentType as EmploymentType, 
      shift.level as EmployeeLevel
    );
    
    if (!rateInfo) {
      return 0;
    }
    
    let hourlyRate: number;
    let condition: string;
    
    // Determine the applicable rate based on day and time
    if (shift.day === 'saturday') {
      condition = 'saturday';
      hourlyRate = rateInfo.rates.saturday.rate;
    } else if (shift.day === 'sunday') {
      condition = 'sunday';
      hourlyRate = rateInfo.rates.sunday.rate;
    } else if (shift.day === 'public-holiday') {
      condition = 'public-holiday';
      hourlyRate = rateInfo.rates['public-holiday'].rate;
    } else if (hasEarlyLateHours(shift.startTime, shift.endTime)) {
      condition = 'shift-early-late';
      hourlyRate = rateInfo.rates['shift-early-late'].rate;
    } else {
      condition = 'base';
      hourlyRate = rateInfo.rates.base.rate;
    }
    
    // Calculate base labor cost
    let laborCost = hourlyRate * hours;
    
    // Apply allowances
    let allowanceCost = 0;
    if (shift.allowances && allowances) {
      shift.allowances.forEach(allowanceId => {
        const allowance = allowances.find(a => a.id === allowanceId);
        if (allowance) {
          if (allowance.unit === 'per-hour') {
            allowanceCost += allowance.amount * hours;
          } else if (allowance.unit === 'per-shift') {
            allowanceCost += allowance.amount;
          } else if (allowance.unit === 'per-day') {
            allowanceCost += allowance.amount;
          }
        }
      });
    }
    
    // Multiply by number of cleaners
    const totalCost = (laborCost + allowanceCost) * (shift.numberOfCleaners || 1);
    return parseFloat(totalCost.toFixed(2));
  };
  
  const handleAddShift = () => {
    const estimatedCost = calculateShiftCost(newShift);
    
    const shiftToAdd: QuoteShift = {
      id: uuidv4(),
      day: newShift.day as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public-holiday',
      startTime: newShift.startTime || '08:00',
      endTime: newShift.endTime || '16:00',
      breakDuration: newShift.breakDuration || 30,
      numberOfCleaners: newShift.numberOfCleaners || 1,
      employmentType: newShift.employmentType as EmploymentType,
      level: newShift.level as EmployeeLevel,
      allowances: newShift.allowances || [],
      estimatedCost,
      location: newShift.location || '',
      notes: newShift.notes || ''
    };
    
    const updatedShifts = [...shifts, shiftToAdd];
    onShiftsChange(updatedShifts);
    
    toast.success('Shift added successfully');
    
    // Reset form
    setNewShift({
      day: 'monday',
      startTime: '08:00',
      endTime: '16:00',
      breakDuration: 30,
      numberOfCleaners: 1,
      employmentType: 'full-time',
      level: 1,
      allowances: [],
      estimatedCost: 0
    });
    
    // Switch to list view
    setActiveTab('list');
  };
  
  const handleDeleteShift = (shiftId: string) => {
    const updatedShifts = shifts.filter(shift => shift.id !== shiftId);
    onShiftsChange(updatedShifts);
    toast.success('Shift deleted');
  };
  
  const handleDuplicateShift = (shift: QuoteShift) => {
    const newId = uuidv4();
    const duplicatedShift = { ...shift, id: newId };
    const updatedShifts = [...shifts, duplicatedShift];
    onShiftsChange(updatedShifts);
    toast.success('Shift duplicated');
  };
  
  const getDayLabel = (day: string): string => {
    const dayItem = DAYS_OF_WEEK.find(d => d.value === day);
    return dayItem ? dayItem.label : day;
  };
  
  const formatAllowances = (shift: QuoteShift): string => {
    if (!shift.allowances || shift.allowances.length === 0) return 'None';
    
    return shift.allowances.map(id => {
      const allowance = allowances.find(a => a.id === id);
      return allowance ? allowance.name : id;
    }).join(', ');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Shift Planner</h3>
          <p className="text-sm text-muted-foreground">
            Plan shifts and calculate costs based on the Cleaning Services Award
          </p>
        </div>
        
        <div className="flex gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="list">Shift List</TabsTrigger>
              <TabsTrigger value="add">Add Shift</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Overtime warnings */}
      {hasOvertimeWarnings && (
        <Card className="bg-amber-50 border-amber-300">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Overtime Warning</h4>
                <p className="text-sm text-amber-700">
                  Some employees are scheduled for more than 38 hours per week, triggering overtime rates:
                </p>
                <ul className="mt-2 text-sm text-amber-700 list-disc pl-5">
                  {Object.entries(overtimeHours).map(([employeeKey, hours], index) => {
                    const [type, level, count] = employeeKey.split('-');
                    return (
                      <li key={index}>
                        {count} x Level {level} {type} employee: {hours.toFixed(1)} hours of overtime
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <TabsContent value="list" className="m-0">
        {shifts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Shifts Added Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding shifts to your quote. Each shift will automatically calculate costs based on the award rates.
              </p>
              <Button onClick={() => setActiveTab('add')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Shift
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Scheduled Shifts</CardTitle>
                <Button size="sm" onClick={() => setActiveTab('add')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Shift
                </Button>
              </div>
              <CardDescription>
                {shifts.length} shift{shifts.length !== 1 ? 's' : ''} scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>Allowances</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shifts.map(shift => (
                      <TableRow key={shift.id}>
                        <TableCell>
                          {getDayLabel(shift.day)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {shift.startTime} - {shift.endTime}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {shift.breakDuration} min break
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {shift.numberOfCleaners} × Level {shift.level}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {shift.employmentType.replace('-', ' ')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-xs">
                                  {shift.allowances && shift.allowances.length > 0 
                                    ? `${shift.allowances.length} allowance${shift.allowances.length !== 1 ? 's' : ''}`
                                    : 'No allowances'}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{formatAllowances(shift)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${shift.estimatedCost.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleDuplicateShift(shift)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteShift(shift.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="pt-0 border-t">
              <div className="w-full flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Total Hours: {shifts.reduce((total, shift) => 
                    total + calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration) * shift.numberOfCleaners, 
                    0
                  ).toFixed(1)}
                </div>
                <div className="text-lg font-medium flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span>Total: ${totalEstimatedCost.toFixed(2)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="add" className="m-0">
        <Card>
          <CardHeader>
            <CardTitle>Add New Shift</CardTitle>
            <CardDescription>
              Create a new shift and calculate costs based on award rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="day">Day of Week</Label>
                  <Select 
                    value={newShift.day} 
                    onValueChange={(value) => handleShiftChange('day', value)}
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
                      onChange={(e) => handleShiftChange('startTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newShift.endTime}
                      onChange={(e) => handleShiftChange('endTime', e.target.value)}
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
                    onChange={(e) => handleShiftChange('breakDuration', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="numberOfCleaners">Number of Cleaners</Label>
                  <Input
                    id="numberOfCleaners"
                    type="number"
                    min="1"
                    value={newShift.numberOfCleaners}
                    onChange={(e) => handleShiftChange('numberOfCleaners', parseInt(e.target.value) || 1)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select 
                      value={newShift.employmentType as string} 
                      onValueChange={(value) => handleShiftChange('employmentType', value)}
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
                      value={newShift.level?.toString()} 
                      onValueChange={(value) => handleShiftChange('level', parseInt(value))}
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
                            onCheckedChange={() => handleAllowanceToggle(allowance.id)}
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
                    onChange={(e) => handleShiftChange('location', e.target.value)}
                    placeholder="e.g., Floor 3, Kitchen area"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={newShift.notes || ''}
                    onChange={(e) => handleShiftChange('notes', e.target.value)}
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
            <Button variant="outline" onClick={() => setActiveTab('list')}>
              Cancel
            </Button>
            <Button onClick={handleAddShift}>
              Add Shift
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </div>
  );
}
