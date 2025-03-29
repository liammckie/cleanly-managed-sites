
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mapFromDb } from '@/lib/utils/mappers';

/**
 * Hook to fetch and manage shifts associated with a given quote.
 * Returns an array of shifts and any loading error.
 */
export function useQuoteShifts(quoteId: string) {
  const [shifts, setShifts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!quoteId) return;
    
    const fetchShifts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('quote_shifts')
          .select('*')
          .eq('quote_id', quoteId);
          
        if (error) {
          setError(error.message);
        } else {
          // Transform snake_case to camelCase
          const formattedData = data ? data.map(shift => mapFromDb(shift)) : [];
          setShifts(formattedData);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred fetching quote shifts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShifts();
  }, [quoteId]);

  return { shifts, error, isLoading };
}
