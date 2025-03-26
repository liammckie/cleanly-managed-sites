
import { supabase } from '@/lib/supabase';
import { QuoteSubcontractor } from '@/lib/types/quotes';
import { convertToQuoteSubcontractor, prepareQuoteSubcontractorForApi } from './utils/subcontractorTypeConversions';

// Fetch all subcontractors for a quote
export const fetchQuoteSubcontractorsByQuoteId = async (quoteId: string): Promise<QuoteSubcontractor[]> => {
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .select('*')
    .eq('quote_id', quoteId)
    .order('id');

  if (error) {
    console.error('Error fetching quote subcontractors:', error);
    throw new Error(`Failed to fetch quote subcontractors: ${error.message}`);
  }

  return (data || []).map(subcontractor => convertToQuoteSubcontractor(subcontractor));
};

// Create a new subcontractor
export const createQuoteSubcontractorMutation = async (subcontractor: Omit<QuoteSubcontractor, 'id'>): Promise<QuoteSubcontractor> => {
  const apiData = prepareQuoteSubcontractorForApi(subcontractor as QuoteSubcontractor);
  
  // Remove ID since we're creating a new record
  delete apiData.id;
  
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .insert([apiData])
    .select()
    .single();

  if (error) {
    console.error('Error creating quote subcontractor:', error);
    throw new Error(`Failed to create quote subcontractor: ${error.message}`);
  }

  return convertToQuoteSubcontractor(data);
};

// Update an existing subcontractor
export const updateQuoteSubcontractorMutation = async (subcontractor: QuoteSubcontractor): Promise<QuoteSubcontractor> => {
  const apiData = prepareQuoteSubcontractorForApi(subcontractor);

  const { data, error } = await supabase
    .from('quote_subcontractors')
    .update(apiData)
    .eq('id', subcontractor.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating quote subcontractor:', error);
    throw new Error(`Failed to update quote subcontractor: ${error.message}`);
  }

  return convertToQuoteSubcontractor(data);
};

// Delete a subcontractor
export const deleteQuoteSubcontractorMutation = async (subcontractorId: string): Promise<void> => {
  const { error } = await supabase
    .from('quote_subcontractors')
    .delete()
    .eq('id', subcontractorId);

  if (error) {
    console.error('Error deleting quote subcontractor:', error);
    throw new Error(`Failed to delete quote subcontractor: ${error.message}`);
  }
};
