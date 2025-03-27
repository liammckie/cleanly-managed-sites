
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuoteShift } from '@/lib/types/quotes';
import { EmploymentType, EmployeeLevel } from '@/types/common';

type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public_holiday' | 'weekday';

const useShiftManagement = (initialShifts: QuoteShift[] = [], quoteId?: string) => {
  const [shifts, setShifts] = useState<QuoteShift[]>(initialShifts);

  // Function to generate a new shift
  const generateNewShift = (quoteId?: string): QuoteShift => {
    const defaultShift: QuoteShift = {
      id: uuidv4(),
      quote_id: quoteId || '',
      day: 'monday' as Day,
      start_time: '09:00',
      end_time: '17:00',
      break_duration: 30,
      number_of_cleaners: 1,
      employment_type: 'full_time' as EmploymentType,
      level: 1 as EmployeeLevel,
      allowances: [],
      estimated_cost: 0,
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
