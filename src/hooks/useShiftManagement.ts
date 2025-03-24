
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuoteShift, EmploymentType, EmployeeLevel, Day } from '@/lib/award/types';

const useShiftManagement = (initialShifts: QuoteShift[] = [], quoteId?: string) => {
  const [shifts, setShifts] = useState<QuoteShift[]>(initialShifts);

  // Function to generate a new shift
  const generateNewShift = (quoteId?: string): QuoteShift => {
    const defaultShift = {
      id: uuidv4(),
      quoteId: quoteId || '',  // Add quoteId property
      day: 'monday' as Day,
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 30,
      numberOfCleaners: 1,
      employmentType: 'full_time' as EmploymentType,
      level: 1 as EmployeeLevel,
      allowances: [],
      estimatedCost: 0,
      location: '',
      notes: ''
    };

    return defaultShift;
  };

  // Add a new shift
  const addShift = useCallback(() => {
    setShifts(prevShifts => [...prevShifts, generateNewShift(quoteId)]);
  }, [quoteId]);

  // Update an existing shift
  const updateShift = useCallback((id: string, updatedShift: Partial<QuoteShift>) => {
    setShifts(prevShifts =>
      prevShifts.map(shift =>
        shift.id === id ? { ...shift, ...updatedShift } : shift
      )
    );
  }, []);

  // Delete a shift
  const deleteShift = useCallback((id: string) => {
    setShifts(prevShifts => prevShifts.filter(shift => shift.id !== id));
  }, []);

  return {
    shifts,
    addShift,
    updateShift,
    deleteShift,
    setShifts,
  };
};

export default useShiftManagement;
