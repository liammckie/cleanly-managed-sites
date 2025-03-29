
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mapFromDb } from '@/lib/utils/mappers';
import { Day, EmployeeLevel, EmploymentType } from '@/types/common';
import type { QuoteShift } from '@/types/models';

/**
 * Hook to fetch and manage shifts associated with a given quote.
 * Returns an array of shifts and functions to add, update, and delete shifts.
 */
export function useQuoteShifts(quoteId: string) {
  const [shifts, setShifts] = useState<QuoteShift[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchShifts = async () => {
    if (!quoteId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('quote_shifts')
        .select('*')
        .eq('quote_id', quoteId);
        
      if (error) {
        throw new Error(error.message);
      } else {
        // Transform data and ensure we have both snake_case and camelCase properties
        const formattedData = (data || []).map(shift => {
          const camelCaseShift = mapFromDb(shift) as any;
          // Ensure we have all properties in both formats
          return {
            ...shift,
            ...camelCaseShift,
            quoteId: shift.quote_id,
            startTime: shift.start_time,
            endTime: shift.end_time,
            breakDuration: shift.break_duration,
            numberOfCleaners: shift.number_of_cleaners,
            employmentType: shift.employment_type,
            estimatedCost: shift.estimated_cost
          } as QuoteShift;
        });
        setShifts(formattedData);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchShifts();
  }, [quoteId]);

  const addShift = async (shiftData: Omit<QuoteShift, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('quote_shifts')
        .insert([{ 
          quote_id: quoteId,
          day: shiftData.day,
          start_time: shiftData.startTime || shiftData.start_time,
          end_time: shiftData.endTime || shiftData.end_time,
          break_duration: shiftData.breakDuration || shiftData.break_duration,
          number_of_cleaners: shiftData.numberOfCleaners || shiftData.number_of_cleaners,
          employment_type: shiftData.employmentType || shiftData.employment_type,
          level: shiftData.level,
          location: shiftData.location,
          notes: shiftData.notes,
          allowances: shiftData.allowances,
          estimated_cost: shiftData.estimatedCost || shiftData.estimated_cost
        }])
        .select();
        
      if (error) throw new Error(error.message);
      
      await fetchShifts(); // Refresh the shifts
      const camelCaseShift = mapFromDb(data[0]) as any;
      return {
        ...data[0],
        ...camelCaseShift,
        quoteId: data[0].quote_id,
        startTime: data[0].start_time,
        endTime: data[0].end_time,
        breakDuration: data[0].break_duration,
        numberOfCleaners: data[0].number_of_cleaners,
        employmentType: data[0].employment_type,
        estimatedCost: data[0].estimated_cost
      } as QuoteShift;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const updateShift = async (shiftId: string, shiftData: Partial<QuoteShift>) => {
    try {
      // Convert to snake_case for the database
      const { data, error } = await supabase
        .from('quote_shifts')
        .update({
          day: shiftData.day,
          start_time: shiftData.startTime || shiftData.start_time,
          end_time: shiftData.endTime || shiftData.end_time,
          break_duration: shiftData.breakDuration || shiftData.break_duration,
          number_of_cleaners: shiftData.numberOfCleaners || shiftData.number_of_cleaners,
          employment_type: shiftData.employmentType || shiftData.employment_type,
          level: shiftData.level,
          location: shiftData.location,
          notes: shiftData.notes,
          allowances: shiftData.allowances,
          estimated_cost: shiftData.estimatedCost || shiftData.estimated_cost
        })
        .eq('id', shiftId)
        .select();
        
      if (error) throw new Error(error.message);
      
      await fetchShifts(); // Refresh the shifts
      const camelCaseShift = mapFromDb(data[0]) as any;
      return {
        ...data[0],
        ...camelCaseShift,
        quoteId: data[0].quote_id,
        startTime: data[0].start_time,
        endTime: data[0].end_time,
        breakDuration: data[0].break_duration,
        numberOfCleaners: data[0].number_of_cleaners,
        employmentType: data[0].employment_type,
        estimatedCost: data[0].estimated_cost
      } as QuoteShift;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const deleteShift = async (shiftId: string) => {
    try {
      const { error } = await supabase
        .from('quote_shifts')
        .delete()
        .eq('id', shiftId);
        
      if (error) throw new Error(error.message);
      
      await fetchShifts(); // Refresh the shifts
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  return { 
    shifts, 
    isLoading, 
    error, 
    addShift, 
    updateShift, 
    deleteShift,
    refetch: fetchShifts
  };
}
