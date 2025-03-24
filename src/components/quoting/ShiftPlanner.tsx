
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { EmploymentType, EmployeeLevel } from '@/lib/award/types';
import { calculateJobCost } from '@/lib/award/awardEngine';
import { useAwardSettings } from '@/hooks/useAwardSettings';

interface ShiftPlannerProps {
  quoteId: string | null;
}

interface Shift {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  numberOfCleaners: number;
  includesToiletCleaning: boolean;
  includesHighRiseCleaning: boolean;
  estimatedCost: number;
}

export function ShiftPlanner({ quoteId }: ShiftPlannerProps) {
  const { settings } = useAwardSettings();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [newShift, setNewShift] = useState<Omit<Shift, 'id' | 'estimatedCost'>>({
    day: 'monday',
    startTime: '06:00',
    endTime: '14:00',
    employmentType: 'full-time',
    level: 1,
    numberOfCleaners: 1,
    includesToiletCleaning: false,
    includesHighRiseCleaning: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentShiftId, setCurrentShiftId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
    { value: 'public-holiday', label: 'Public Holiday' },
  ];

  const calculateShiftHours = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  const determinePayCondition = (day: string, startTime: string, endTime: string) => {
    const hoursOfDay = calculateShiftHours(startTime, endTime);
    
    // Basic conditions based on day of week
    switch (day) {
      case 'saturday':
        return { condition: 'saturday', hours: hoursOfDay };
      case 'sunday':
        return { condition: 'sunday', hours: hoursOfDay };
      case 'public-holiday':
        return { condition: 'public-holiday', hours: hoursOfDay };
      default: // Weekdays
        // Check if early/late shift (before 6am or after 6pm)
        const startHour = parseInt(startTime.split(':')[0]);
        const endHour = parseInt(endTime.split(':')[0]);
        
        if (startHour < 6 || endHour >= 18) {
          return { condition: 'shift-early-late', hours: hoursOfDay };
        } else {
          return { condition: 'base', hours: hoursOfDay };
        }
    }
  };

  const estimateShiftCost = (shift: Omit<Shift, 'id' | 'estimatedCost'>) => {
    const { condition, hours } = determinePayCondition(shift.day, shift.startTime, shift.endTime);
    
    // Create hours object for award engine
    const hoursObj: Record<string, number> = {};
    hoursObj[condition] = hours;
    
    try {
      const costResult = calculateJobCost({
        employmentType: shift.employmentType,
        level: shift.level,
        hours: hoursObj,
        overheadPercentage: settings.overheadPercentageDefault,
        marginPercentage: settings.marginPercentageDefault
      }, settings.baseRateMultiplier);
      
      // Multiply by number of cleaners
      return costResult.totalPrice * shift.numberOfCleaners;
    } catch (error) {
      console.error('Error calculating shift cost:', error);
      return 0;
    }
  };

  const handleInputChange = (field: keyof Omit<Shift, 'id' | 'estimatedCost'>, value: any) => {
    setNewShift(prev => ({ ...prev, [field]: value }));
  };

  const handleAddShift = () => {
    if (isEditing && currentShiftId) {
      // Update existing shift
      setShifts(shifts.map(shift => 
        shift.id === currentShiftId ? 
        { 
          ...newShift, 
          id: shift.id, 
          estimatedCost: estimateShiftCost(newShift) 
        } : shift
      ));
    } else {
      // Add new shift
      const shiftCost = estimateShiftCost(newShift);
      setShifts([...shifts, { ...newShift, id: crypto.randomUUID(), estimatedCost: shiftCost }]);
    }
    
    // Reset form
    setNewShift({
      day: 'monday',
      startTime: '06:00',
      endTime: '14:00',
      employmentType: 'full-time',
      level: 1,
      numberOfCleaners: 1,
      includesToiletCleaning: false,
      includesHighRiseCleaning: false
    });
    setIsEditing(false);
    setCurrentShiftId(null);
    setDialogOpen(false);
  };

  const handleEditShift = (shiftId: string) => {
    const shiftToEdit = shifts.find(s => s.id === shiftId);
    if (shiftToEdit) {
      const { id, estimatedCost, ...restShift } = shiftToEdit;
      setNewShift(restShift);
      setIsEditing(true);
      setCurrentShiftId(id);
      setDialogOpen(true);
    }
  };

  const handleDeleteShift = (shiftId: string) => {
    if (confirm('Are you sure you want to delete this shift?')) {
      setShifts(shifts.filter(s => s.id !== shiftId));
    }
  };

  // Calculate totals
  const totalEstimatedCost = shifts.reduce((sum, shift) => sum + shift.estimatedCost, 0);
  const totalHours = shifts.reduce((sum, shift) => {
    const hours = calculateShiftHours(shift.startTime, shift.endTime);
    return sum + (hours * shift.numberOfCleaners);
  }, 0);

  // Sort shifts by day for display
  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'public-holiday'];
  const sortedShifts = [...shifts].sort((a, b) => {
    const dayOrderA = dayOrder.indexOf(a.day);
    const dayOrderB = dayOrder.indexOf(b.day);
    if (dayOrderA !== dayOrderB) return dayOrderA - dayOrderB;
    
    // If same day, sort by start time
    const startTimeA = a.startTime;
    const startTimeB = b.startTime;
    return startTimeA.localeCompare(startTimeB);
  });

  const getDayLabel = (day: string) => {
    return dayOptions.find(d => d.value === day)?.label || day;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Shift Planning</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Shift
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Shift' : 'Add New Shift'}</DialogTitle>
              <DialogDescription>
                Plan a cleaning shift with appropriate staff and timing
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Day</Label>
                  <Select 
                    value={newShift.day} 
                    onValueChange={(value) => handleInputChange('day', value)}
                  >
                    <SelectTrigger id="day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {dayOptions.map(day => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
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
                    value={newShift.numberOfCleaners} 
                    onChange={(e) => handleInputChange('numberOfCleaners', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime" 
                    type="time" 
                    value={newShift.startTime} 
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input 
                    id="endTime" 
                    type="time" 
                    value={newShift.endTime} 
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select 
                    value={newShift.employmentType} 
                    onValueChange={(value) => handleInputChange('employmentType', value as EmploymentType)}
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
                
                <div className="space-y-2">
                  <Label htmlFor="level">Employee Level</Label>
                  <Select 
                    value={newShift.level.toString()} 
                    onValueChange={(value) => handleInputChange('level', parseInt(value) as EmployeeLevel)}
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
              
              <Separator className="my-2" />
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Additional Allowances</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="toilet-cleaning" className="flex-1">
                    Includes toilet cleaning
                  </Label>
                  <Switch 
                    id="toilet-cleaning" 
                    checked={newShift.includesToiletCleaning}
                    onCheckedChange={(checked) => handleInputChange('includesToiletCleaning', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-rise-cleaning" className="flex-1">
                    High-rise work (above 22nd floor)
                  </Label>
                  <Switch 
                    id="high-rise-cleaning" 
                    checked={newShift.includesHighRiseCleaning}
                    onCheckedChange={(checked) => handleInputChange('includesHighRiseCleaning', checked)}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddShift}>
                {isEditing ? 'Update Shift' : 'Add Shift'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {shifts.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Shifts Added Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Click "Add Shift" to start planning your cleaning schedule. Each shift will be calculated according to the Award rates.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Shift
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Shift Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead className="text-right">Est. Cost</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedShifts.map(shift => (
                    <TableRow key={shift.id}>
                      <TableCell>{getDayLabel(shift.day)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> 
                          {shift.startTime} - {shift.endTime}
                        </div>
                        {(shift.includesToiletCleaning || shift.includesHighRiseCleaning) && (
                          <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {shift.includesToiletCleaning && 'Toilet cleaning'}
                            {shift.includesToiletCleaning && shift.includesHighRiseCleaning && ', '}
                            {shift.includesHighRiseCleaning && 'High-rise work'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {shift.numberOfCleaners} × Level {shift.level} ({shift.employmentType})
                      </TableCell>
                      <TableCell>
                        {calculateShiftHours(shift.startTime, shift.endTime).toFixed(1)} hrs
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${shift.estimatedCost.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditShift(shift.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteShift(shift.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="bg-muted/30 border rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Shifts</div>
                <div className="text-2xl font-bold">{shifts.length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Hours</div>
                <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Weekly Cost</div>
                <div className="text-2xl font-bold">${totalEstimatedCost.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Monthly Cost (est.)</div>
                <div className="text-2xl font-bold">${(totalEstimatedCost * 4.33).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
