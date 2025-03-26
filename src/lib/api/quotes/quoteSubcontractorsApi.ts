
import { supabase } from '@/lib/supabase';
import { QuoteSubcontractor } from '@/lib/types/award/types';
import { 
  convertDbSubcontractorToModel,
  convertModelSubcontractorToDb
} from './utils/subcontractorTypeConversions';

// Fetch subcontractors for a specific quote
export const fetchQuoteSubcontractorsByQuoteId = async (quoteId: string): Promise<QuoteSubcontractor[]> => {
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .select('*')
    .eq('quote_id', quoteId);

  if (error) {
    console.error('Error fetching quote subcontractors:', error);
    throw new Error(`Failed to fetch quote subcontractors: ${error.message}`);
  }

  return data.map(subcontractor => convertDbSubcontractorToModel(subcontractor));
};

// Create a new subcontractor for a quote
export const createQuoteSubcontractor = async (subcontractorData: Partial<QuoteSubcontractor>): Promise<QuoteSubcontractor> => {
  const dbData = convertModelSubcontractorToDb(subcontractorData);
  
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .insert([dbData])
    .select()
    .single();

  if (error) {
    console.error('Error creating quote subcontractor:', error);
    throw new Error(`Failed to create quote subcontractor: ${error.message}`);
  }

  return convertDbSubcontractorToModel(data);
};

// Update an existing quote subcontractor
export const updateQuoteSubcontractor = async (subcontractorData: QuoteSubcontractor): Promise<QuoteSubcontractor> => {
  const dbData = convertModelSubcontractorToDb(subcontractorData);
  
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .update(dbData)
    .eq('id', subcontractorData.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating quote subcontractor:', error);
    throw new Error(`Failed to update quote subcontractor: ${error.message}`);
  }

  return convertDbSubcontractorToModel(data);
};

// Delete a quote subcontractor
export const deleteQuoteSubcontractor = async (subcontractorId: string): Promise<void> => {
  const { error } = await supabase
    .from('quote_subcontractors')
    .delete()
    .eq('id', subcontractorId);

  if (error) {
    console.error('Error deleting quote subcontractor:', error);
    throw new Error(`Failed to delete quote subcontractor: ${error.message}`);
  }
};
