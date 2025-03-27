
import { supabase } from '@/lib/supabase';
import { Quote } from './utils/quoteDbTypeAdapter';
import { convertToDbQuote, convertDbToQuote } from './utils/quoteDbTypeAdapter';

// Create a new quote
export const createQuote = async (quoteData: Partial<Quote>) => {
  try {
    // Convert from frontend format to database format
    const dbQuote = {
      ...convertToDbQuote(quoteData),
      // Set defaults for required fields if not provided
      name: quoteData.name || 'New Quote',
      status: quoteData.status || 'draft',
      total_price: quoteData.total_price || 0,
      total_cost: quoteData.total_cost || 0,
      margin_amount: quoteData.margin_amount || 0,
      margin_percentage: quoteData.margin_percentage || 20,
      overhead_cost: quoteData.overhead_cost || 0,
      overhead_percentage: quoteData.overhead_percentage || 15,
      labor_cost: quoteData.labor_cost || 0,
      subcontractor_cost: quoteData.subcontractor_cost || 0,
      created_by: quoteData.created_by,
      user_id: quoteData.userId,
      overhead_profile: quoteData.overheadProfile || 'standard'
    };

    const { data, error } = await supabase
      .from('quotes')
      .insert(dbQuote)
      .select()
      .single();

    if (error) {
      console.error('Error creating quote:', error);
      throw new Error(`Failed to create quote: ${error.message}`);
    }

    return convertDbToQuote(data);
  } catch (error: any) {
    console.error('Error in createQuote:', error);
    throw error;
  }
};

// Get all quotes
export const getQuotes = async (): Promise<Quote[]> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quotes:', error);
      throw new Error(`Failed to fetch quotes: ${error.message}`);
    }

    return (data || []).map(convertDbToQuote);
  } catch (error: any) {
    console.error('Error in getQuotes:', error);
    throw error;
  }
};
