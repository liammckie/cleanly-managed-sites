
import { supabase } from '@/lib/supabase';
import { Quote } from '@/types/models';
import { adaptQuoteToFrontend, adaptQuoteToApi } from '@/utils/typeAdapters';
import { QuoteDTO } from '@/types/dto';

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

    // Convert each quote to the frontend format
    return (data || []).map(quote => {
      const adaptedQuote = adaptQuoteToFrontend(quote);
      // Type assertion to override the status type issue
      return adaptedQuote as unknown as Quote;
    });
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

    // Type assertion to override the status type issue
    return adaptQuoteToFrontend(data) as unknown as Quote;
  } catch (error) {
    console.error(`Error fetching quote ${quoteId}:`, error);
    throw error;
  }
};

// Create a new quote
export const createQuote = async (quoteData: Partial<Quote>): Promise<Quote> => {
  try {
    // Convert from frontend format to API format
    const apiData = adaptQuoteToApi(quoteData);
    
    const { data, error } = await supabase
      .from('quotes')
      .insert([apiData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Type assertion to override the status type issue
    return adaptQuoteToFrontend(data) as unknown as Quote;
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
};

// Update an existing quote
export const updateQuote = async (quoteId: string, quoteData: Partial<Quote>): Promise<Quote> => {
  try {
    // Convert from frontend format to API format
    const apiData = adaptQuoteToApi(quoteData);
    
    const { data, error } = await supabase
      .from('quotes')
      .update(apiData)
      .eq('id', quoteId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Type assertion to override the status type issue
    return adaptQuoteToFrontend(data) as unknown as Quote;
  } catch (error) {
    console.error(`Error updating quote ${quoteId}:`, error);
    throw error;
  }
};

// Delete a quote
export const deleteQuote = async (quoteId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', quoteId);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error(`Error deleting quote ${quoteId}:`, error);
    throw error;
  }
};
