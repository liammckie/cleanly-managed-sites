
import { supabase } from '@/lib/supabase';

// Fetch subcontractors for a quote
export const fetchQuoteSubcontractors = async (quoteId: string) => {
  if (!quoteId) return [];
  
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .select('*')
    .eq('quote_id', quoteId);
  
  if (error) {
    console.error('Error fetching quote subcontractors:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Add subcontractors to a quote
export const addQuoteSubcontractors = async (quoteId: string, subcontractors: any[]) => {
  if (!quoteId || !subcontractors.length) return [];
  
  const subcontractorsWithQuoteId = subcontractors.map(subcontractor => ({
    ...subcontractor,
    quote_id: quoteId
  }));
  
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .insert(subcontractorsWithQuoteId)
    .select();
  
  if (error) {
    console.error('Error adding subcontractors:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Update subcontractors for a quote
export const updateQuoteSubcontractors = async (quoteId: string, subcontractors: any[]) => {
  if (!quoteId) return [];
  
  // Delete all existing subcontractors
  const { error: deleteError } = await supabase
    .from('quote_subcontractors')
    .delete()
    .eq('quote_id', quoteId);
  
  if (deleteError) {
    console.error('Error deleting existing subcontractors:', deleteError);
    throw new Error(deleteError.message);
  }
  
  // If no new subcontractors, return empty array
  if (!subcontractors.length) return [];
  
  // Add the new subcontractors
  return addQuoteSubcontractors(quoteId, subcontractors);
};
