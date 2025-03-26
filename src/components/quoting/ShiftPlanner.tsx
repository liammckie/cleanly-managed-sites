
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ShiftForm } from './shift-planner/ShiftForm';
import { ShiftList } from './shift-planner/ShiftList';
import { useAllowances } from '@/hooks/quotes/useAllowances';
import { QuoteShift } from '@/types/models';
import { ShiftPlannerProps } from './types';

export function ShiftPlanner({
  shifts = [],
  onAddShift,
  onRemoveShift,
  onShiftsChange,
  quoteId
}: ShiftPlannerProps) {
  const [showForm, setShowForm] = useState(false);
  const [currentShift, setCurrentShift] = useState<Partial<QuoteShift>>({
    id: uuidv4(),
    quoteId: quoteId || '',
    day: 'monday',
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 30,
    numberOfCleaners: 1,
    employmentType: 'casual',
    level: 1,
    allowances: [],
    location: '',
    notes: '',
    estimatedCost: 0
  });
  
  const { data: allowances = [], isLoading: isLoadingAllowances } = useAllowances();
  
  // Open the form to add a new shift
  const handleAddNewClick = () => {
    setCurrentShift({
      id: uuidv4(),
      quoteId: quoteId || '',
      day: 'monday',
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 30,
      numberOfCleaners: 1,
      employmentType: 'casual',
      level: 1,
      allowances: [],
      location: '',
      notes: '',
      estimatedCost: 0
    });
    setShowForm(true);
  };
  
  // Close the shift form
  const handleCancelForm = () => {
    setShowForm(false);
  };
  
  // Update a field in the current shift
  const handleShiftChange = (field: string, value: any) => {
    setCurrentShift(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Toggle an allowance in the current shift
  const handleAllowanceToggle = (allowanceId: string) => {
    setCurrentShift(prev => {
      const allowances = prev.allowances || [];
      const index = allowances.indexOf(allowanceId);
      
      if (index >= 0) {
        // Remove allowance
        const newAllowances = [...allowances];
        newAllowances.splice(index, 1);
        return { ...prev, allowances: newAllowances };
      } else {
        // Add allowance
        return { ...prev, allowances: [...allowances, allowanceId] };
      }
    });
  };
  
  // Add the current shift to the list
  const handleAddShift = () => {
    if (typeof onAddShift === 'function') {
      onAddShift(currentShift);
    } else if (typeof onShiftsChange === 'function') {
      // If no onAddShift but there's onShiftsChange, add it to the array directly
      const newShift = {
        ...currentShift,
        id: currentShift.id || uuidv4()
      } as QuoteShift;
      
      onShiftsChange([...shifts, newShift]);
    }
    
    setShowForm(false);
  };
  
  // Remove a shift from the list
  const handleRemoveShift = (shiftId: string) => {
    if (typeof onRemoveShift === 'function') {
      onRemoveShift(shiftId);
    } else if (typeof onShiftsChange === 'function') {
      // If no onRemoveShift but there's onShiftsChange, remove it from the array directly
      onShiftsChange(shifts.filter(shift => shift.id !== shiftId));
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Shifts</CardTitle>
        <Button onClick={handleAddNewClick} disabled={showForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Shift
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {showForm ? (
          <ShiftForm
            shift={currentShift}
            onShiftChange={handleShiftChange}
            onAllowanceToggle={handleAllowanceToggle}
            onAddShift={handleAddShift}
            onCancel={handleCancelForm}
            allowances={allowances}
            isLoadingAllowances={isLoadingAllowances}
          />
        ) : (
          <ShiftList shifts={shifts} onRemoveShift={handleRemoveShift} />
        )}
        
        {!showForm && shifts.length === 0 && (
          <div className="text-center p-4 text-muted-foreground">
            No shifts added yet. Click "Add Shift" to create your first shift.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
