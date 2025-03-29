
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mapFromDb } from '@/lib/utils/mappers';
import { Frequency } from '@/types/common';

interface QuoteSubcontractor {
  id: string;
  quoteId: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  notes?: string;
  service?: string;
}

/**
 * Hook to fetch and manage subcontractors associated with a given quote.
 * Returns an array of subcontractors and functions to add, update, and delete subcontractors.
 */
export function useQuoteSubcontractors(quoteId: string) {
  const [subcontractors, setSubcontractors] = useState<QuoteSubcontractor[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubcontractors = async () => {
    if (!quoteId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('quote_subcontractors')
        .select('*')
        .eq('quote_id', quoteId);
        
      if (error) {
        throw new Error(error.message);
      } else {
        // Transform snake_case to camelCase
        const formattedData = data ? data.map(subcontractor => mapFromDb(subcontractor)) : [];
        setSubcontractors(formattedData as QuoteSubcontractor[]);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSubcontractors();
  }, [quoteId]);

  const addSubcontractor = async (subcontractorData: Omit<QuoteSubcontractor, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('quote_subcontractors')
        .insert([{ 
          quote_id: quoteId,
          name: subcontractorData.name,
          description: subcontractorData.description,
          cost: subcontractorData.cost,
          frequency: subcontractorData.frequency
        }])
        .select();
        
      if (error) throw new Error(error.message);
      
      await fetchSubcontractors(); // Refresh the subcontractors
      return mapFromDb(data[0]);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const updateSubcontractor = async (subcontractorId: string, subcontractorData: Partial<QuoteSubcontractor>) => {
    try {
      const { data, error } = await supabase
        .from('quote_subcontractors')
        .update({
          name: subcontractorData.name,
          description: subcontractorData.description,
          cost: subcontractorData.cost,
          frequency: subcontractorData.frequency
        })
        .eq('id', subcontractorId)
        .select();
        
      if (error) throw new Error(error.message);
      
      await fetchSubcontractors(); // Refresh the subcontractors
      return mapFromDb(data[0]);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const deleteSubcontractor = async (subcontractorId: string) => {
    try {
      const { error } = await supabase
        .from('quote_subcontractors')
        .delete()
        .eq('id', subcontractorId);
        
      if (error) throw new Error(error.message);
      
      await fetchSubcontractors(); // Refresh the subcontractors
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  return { 
    subcontractors, 
    isLoading, 
    error, 
    addSubcontractor, 
    updateSubcontractor, 
    deleteSubcontractor,
    refetch: fetchSubcontractors
  };
}
