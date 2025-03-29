
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mapFromDb } from '@/lib/utils/mappers';

interface QuoteShift {
  id: string;
  quoteId: string;
  day: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: string;
  level: number;
  location?: string;
  notes?: string;
  allowances?: string[];
  estimatedCost: number;
}

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
        // Transform snake_case to camelCase
        const formattedData = data ? data.map(shift => mapFromDb(shift)) : [];
        setShifts(formattedData as QuoteShift[]);
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
          start_time: shiftData.startTime,
          end_time: shiftData.endTime,
          break_duration: shiftData.breakDuration,
          number_of_cleaners: shiftData.numberOfCleaners,
          employment_type: shiftData.employmentType,
          level: shiftData.level,
          location: shiftData.location,
          notes: shiftData.notes,
          allowances: shiftData.allowances,
          estimated_cost: shiftData.estimatedCost
        }])
        .select();
        
      if (error) throw new Error(error.message);
      
      await fetchShifts(); // Refresh the shifts
      return mapFromDb(data[0]);
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
          start_time: shiftData.startTime,
          end_time: shiftData.endTime,
          break_duration: shiftData.breakDuration,
          number_of_cleaners: shiftData.numberOfCleaners,
          employment_type: shiftData.employmentType,
          level: shiftData.level,
          location: shiftData.location,
          notes: shiftData.notes,
          allowances: shiftData.allowances,
          estimated_cost: shiftData.estimatedCost
        })
        .eq('id', shiftId)
        .select();
        
      if (error) throw new Error(error.message);
      
      await fetchShifts(); // Refresh the shifts
      return mapFromDb(data[0]);
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
