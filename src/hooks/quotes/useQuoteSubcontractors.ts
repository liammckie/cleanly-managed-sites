
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mapFromDb } from '@/lib/utils/mappers';
import { Frequency } from '@/types/common';
import type { QuoteSubcontractor } from '@/types/models';

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
        // Transform data and ensure we have both snake_case and camelCase properties
        const formattedData = (data || []).map(subcontractor => {
          const camelCaseSubcontractor = mapFromDb(subcontractor) as any;
          // Ensure we have all properties in both formats
          return {
            ...subcontractor,
            ...camelCaseSubcontractor,
            quoteId: subcontractor.quote_id
          } as QuoteSubcontractor;
        });
        setSubcontractors(formattedData);
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
      const camelCaseSubcontractor = mapFromDb(data[0]) as any;
      return {
        ...data[0],
        ...camelCaseSubcontractor,
        quoteId: data[0].quote_id
      } as QuoteSubcontractor;
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
      const camelCaseSubcontractor = mapFromDb(data[0]) as any;
      return {
        ...data[0],
        ...camelCaseSubcontractor,
        quoteId: data[0].quote_id
      } as QuoteSubcontractor;
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
