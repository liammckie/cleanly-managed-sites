
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Day, EmploymentType, EmployeeLevel } from '@/types/common';

// Interface for shift data
interface ShiftData {
  id: string;
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimatedCost: number;
  location?: string;
  notes?: string;
}

export const useShiftManagement = (initialShifts: ShiftData[] = []) => {
  const [shifts, setShifts] = useState<ShiftData[]>(initialShifts);

  // Add a new shift
  const addShift = (shiftData: Partial<ShiftData> = {}) => {
    const newShift: ShiftData = {
      id: uuidv4(),
      day: shiftData.day || 'monday',
      startTime: shiftData.startTime || '09:00',
      endTime: shiftData.endTime || '17:00',
      breakDuration: shiftData.breakDuration || 30,
      numberOfCleaners: shiftData.numberOfCleaners || 1,
      employmentType: shiftData.employmentType || 'casual',
      level: shiftData.level || 1,
      allowances: shiftData.allowances || [],
      estimatedCost: shiftData.estimatedCost || 0,
      location: shiftData.location || '',
      notes: shiftData.notes || '',
    };

    setShifts(prevShifts => [...prevShifts, newShift]);
    return newShift;
  };

  // Update an existing shift
  const updateShift = (shiftId: string, updatedData: Partial<ShiftData>) => {
    setShifts(prevShifts => 
      prevShifts.map(shift => 
        shift.id === shiftId ? { ...shift, ...updatedData } : shift
      )
    );
  };

  // Remove a shift
  const removeShift = (shiftId: string) => {
    setShifts(prevShifts => prevShifts.filter(shift => shift.id !== shiftId));
  };

  // Set all shifts
  const setAllShifts = (newShifts: ShiftData[]) => {
    setShifts(newShifts);
  };

  return {
    shifts,
    addShift,
    updateShift,
    removeShift,
    setAllShifts
  };
};
