
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { QuoteShift, EmploymentType, EmployeeLevel } from '@/lib/award/types';
import { calculateShiftCost } from '@/lib/award/shiftCalculations';

export function useShiftManagement(initialShifts: QuoteShift[], onShiftsChange: (shifts: QuoteShift[]) => void) {
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
  
  const handleAddShift = () => {
    if (!newShift.day || !newShift.startTime || !newShift.endTime || !newShift.employmentType || !newShift.level) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    // Calculate the estimated cost of the shift
    const estimatedCost = calculateShiftCost(newShift);
    
    const shiftToAdd: QuoteShift = {
      id: uuidv4(),
      day: newShift.day as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public-holiday',
      startTime: newShift.startTime,
      endTime: newShift.endTime,
      breakDuration: newShift.breakDuration || 30,
      numberOfCleaners: newShift.numberOfCleaners || 1,
      employmentType: newShift.employmentType as EmploymentType,
      level: newShift.level as EmployeeLevel,
      allowances: newShift.allowances || [],
      estimatedCost,
      location: newShift.location || '',
      notes: newShift.notes || ''
    };
    
    const updatedShifts = [...initialShifts, shiftToAdd];
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
    
    return true;
  };
  
  const handleDeleteShift = (shiftId: string) => {
    const updatedShifts = initialShifts.filter(shift => shift.id !== shiftId);
    onShiftsChange(updatedShifts);
    toast.success('Shift deleted');
  };
  
  const handleDuplicateShift = (shift: QuoteShift) => {
    const newId = uuidv4();
    const duplicatedShift = { ...shift, id: newId };
    const updatedShifts = [...initialShifts, duplicatedShift];
    onShiftsChange(updatedShifts);
    toast.success('Shift duplicated');
  };
  
  const handleUpdateShift = (updatedShift: QuoteShift) => {
    // Update the estimated cost
    const estimatedCost = calculateShiftCost(updatedShift);
    updatedShift.estimatedCost = estimatedCost;
    
    // Find the index of the shift to update
    const shiftIndex = initialShifts.findIndex(shift => shift.id === updatedShift.id);
    
    if (shiftIndex === -1) {
      toast.error('Shift not found');
      return;
    }
    
    // Create a new array with the updated shift
    const updatedShifts = [
      ...initialShifts.slice(0, shiftIndex),
      updatedShift,
      ...initialShifts.slice(shiftIndex + 1)
    ];
    
    onShiftsChange(updatedShifts);
  };
  
  const applyShiftTemplate = (template: { 
    name: string; 
    startTime: string; 
    endTime: string; 
    breakDuration: number;
    description: string; 
  }) => {
    setNewShift(prev => ({
      ...prev,
      startTime: template.startTime,
      endTime: template.endTime,
      breakDuration: template.breakDuration
    }));
    
    toast.success(`Applied template: ${template.name}`);
  };
  
  return {
    newShift,
    shiftBeingEdited,
    setShiftBeingEdited,
    handleShiftChange,
    handleAllowanceToggle,
    handleAddShift,
    handleDeleteShift,
    handleDuplicateShift,
    handleUpdateShift,
    applyShiftTemplate
  };
}
