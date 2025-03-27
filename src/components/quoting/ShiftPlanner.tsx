
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';
import { QuoteShift, FrontendQuoteShift } from '@/types/models';
import { ShiftPlannerProps } from './types';
import { ShiftList } from './ShiftList';
import { Day, EmployeeLevel, EmploymentType } from '@/types/common';
import { adaptQuoteShift } from '@/utils/quoteAdapters';

export const ShiftPlanner: React.FC<ShiftPlannerProps> = ({ 
  shifts = [], 
  onShiftsChange,
  quoteId,
  onAddShift,
  onRemoveShift
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<FrontendQuoteShift>>({
    day: 'monday' as Day,
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 30,
    numberOfCleaners: 1,
    employmentType: 'casual' as EmploymentType,
    level: 1 as EmployeeLevel,
    location: 'Main Area',
    notes: '',
    allowances: [],
    estimatedCost: 0
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate a rough estimated cost (this could be refined with a proper calculation)
    const hours = calculateHours(formData.startTime || '09:00', formData.endTime || '17:00', formData.breakDuration || 30);
    const hourlyRate = (formData.level || 1) * 25; // Simple calculation, should be replaced with actual award rates
    const estimatedCost = hours * hourlyRate * (formData.numberOfCleaners || 1);
    
    const newShiftData: Partial<FrontendQuoteShift> = {
      ...formData,
      quoteId: quoteId || '',
      estimatedCost
    };
    
    if (onAddShift) {
      onAddShift(newShiftData);
    } else if (onShiftsChange) {
      // Convert to a unified QuoteShift using the adapter
      const newShift = adaptQuoteShift({
        id: uuidv4(),
        quoteId: quoteId || '',
        day: formData.day as Day,
        startTime: formData.startTime || '09:00',
        endTime: formData.endTime || '17:00',
        breakDuration: formData.breakDuration || 30,
        numberOfCleaners: formData.numberOfCleaners || 1,
        employmentType: formData.employmentType as EmploymentType,
        level: formData.level as EmployeeLevel,
        location: formData.location || 'Main Area',
        notes: formData.notes || '',
        allowances: formData.allowances || [],
        estimatedCost
      });
      
      onShiftsChange([...shifts, newShift]);
    }
    
    // Reset form
    setFormData({
      day: 'monday' as Day,
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 30,
      numberOfCleaners: 1,
      employmentType: 'casual' as EmploymentType,
      level: 1 as EmployeeLevel,
      location: 'Main Area',
      notes: '',
      allowances: [],
      estimatedCost: 0
    });
    setShowForm(false);
  };

  const handleRemoveShift = (shiftId: string) => {
    if (onRemoveShift) {
      onRemoveShift(shiftId);
    } else if (onShiftsChange) {
      onShiftsChange(shifts.filter(s => s.id !== shiftId));
    }
  };

  // Calculate work hours accounting for breaks
  const calculateHours = (startTime: string, endTime: string, breakMinutes: number): number => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    const totalMinutes = endMinutes - startMinutes - breakMinutes;
    return totalMinutes / 60;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Cleaning Shifts</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Shift
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Cleaning Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Day</Label>
                  <Select 
                    value={formData.day as string} 
                    onValueChange={(value) => handleChange('day', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="weekday">Weekday</SelectItem>
                      <SelectItem value="public_holiday">Public Holiday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input 
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                  <Input 
                    id="breakDuration"
                    type="number"
                    min="0"
                    step="5"
                    value={formData.breakDuration}
                    onChange={(e) => handleChange('breakDuration', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfCleaners">Number of Cleaners</Label>
                  <Input 
                    id="numberOfCleaners"
                    type="number"
                    min="1"
                    value={formData.numberOfCleaners}
                    onChange={(e) => handleChange('numberOfCleaners', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select 
                    value={formData.employmentType as string} 
                    onValueChange={(value) => handleChange('employmentType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="full_time">Full Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select 
                    value={String(formData.level)} 
                    onValueChange={(value) => handleChange('level', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Level 1</SelectItem>
                      <SelectItem value="2">Level 2</SelectItem>
                      <SelectItem value="3">Level 3</SelectItem>
                      <SelectItem value="4">Level 4</SelectItem>
                      <SelectItem value="5">Level 5</SelectItem>
                      <SelectItem value="6">Level 6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g. Office Area, Kitchen, Main Building"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Additional information about this shift"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Shift
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <ShiftList shifts={shifts as any} onRemoveShift={handleRemoveShift} />
      
      {shifts.length > 0 && (
        <div className="mt-4 p-4 border rounded-md bg-muted/30">
          <div className="flex justify-between items-center">
            <p className="font-medium">Total Shift Cost:</p>
            <p className="font-bold">
              ${shifts.reduce((sum, shift) => {
                // Handle both camelCase and snake_case properties
                const cost = 'estimatedCost' in shift 
                  ? (shift.estimatedCost || 0) 
                  : (shift.estimated_cost || 0);
                return sum + cost;
              }, 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
