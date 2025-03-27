
import { supabase } from '@/lib/supabase';
import { Quote } from '@/types/models';
import { adaptQuote, adaptModelsToQuotes } from '@/lib/utils/quoteTypeAdapter';

// Fetch all quotes
export const fetchQuotes = async (): Promise<Quote[]> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return adaptModelsToQuotes(data || []);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

// Fetch a specific quote
export const fetchQuote = async (quoteId: string): Promise<Quote> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        shifts:quote_shifts(*),
        subcontractors:quote_subcontractors(*)
      `)
      .eq('id', quoteId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return adaptQuote(data);
  } catch (error) {
    console.error(`Error fetching quote ${quoteId}:`, error);
    throw error;
  }
};

// Create a new quote
export const createQuote = async (quoteData: Partial<Quote>): Promise<Quote> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .insert(quoteData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return adaptQuote(data);
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
};

// Update an existing quote
export const updateQuote = async (quoteId: string, quoteData: Partial<Quote>): Promise<Quote> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .update(quoteData)
      .eq('id', quoteId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return adaptQuote(data);
  } catch (error) {
    console.error(`Error updating quote ${quoteId}:`, error);
    throw error;
  }
};
