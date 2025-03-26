
import { supabase } from '@/lib/supabase';
import { Quote } from '@/types/models';
import { fetchQuoteShiftsByQuoteId } from './quoteShiftsApi';
import { fetchQuoteSubcontractorsByQuoteId } from './quoteSubcontractorsApi';
import { calculateTotalCosts } from '@/utils/quoteCalculations';
import { adaptQuote, adaptQuotes, prepareQuoteForApi } from './utils/quoteAdapter';

// Fetch all quotes for the current user
export const fetchQuotes = async (): Promise<Quote[]> => {
  const { data: quotes, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quotes:', error);
    throw new Error(`Failed to fetch quotes: ${error.message}`);
  }

  // Use the adapter to convert database records to Quote objects
  return adaptQuotes(quotes);
};

// Fetch a single quote by ID, including shifts and subcontractors
export const fetchQuoteById = async (quoteId: string): Promise<Quote> => {
  // Fetch the quote
  const { data: quote, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .single();

  if (error) {
    console.error('Error fetching quote:', error);
    throw new Error(`Failed to fetch quote: ${error.message}`);
  }

  // Fetch related shifts and subcontractors
  const shifts = await fetchQuoteShiftsByQuoteId(quoteId);
  const subcontractors = await fetchQuoteSubcontractorsByQuoteId(quoteId);

  // Use the adapter to convert the database record to a Quote object
  const mappedQuote = adaptQuote(quote);
  
  // Add the relationships
  mappedQuote.shifts = shifts;
  mappedQuote.subcontractors = subcontractors;

  return mappedQuote;
};

// Create a new quote
export const createQuoteMutation = async (quoteData: Partial<Quote>): Promise<Quote> => {
  // Prepare data for insertion using the adapter
  const dbQuoteData = prepareQuoteForApi(quoteData);

  // Insert the quote
  const { data: createdQuote, error } = await supabase
    .from('quotes')
    .insert([dbQuoteData])
    .select()
    .single();

  if (error) {
    console.error('Error creating quote:', error);
    throw new Error(`Failed to create quote: ${error.message}`);
  }

  // Convert the created quote to a Quote object using the adapter
  return adaptQuote(createdQuote);
};

// Update an existing quote
export const updateQuoteMutation = async (quoteData: Quote): Promise<Quote> => {
  // Prepare data for update using the adapter
  const dbQuoteData = prepareQuoteForApi(quoteData);

  // Update the quote
  const { data: updatedQuote, error } = await supabase
    .from('quotes')
    .update(dbQuoteData)
    .eq('id', quoteData.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating quote:', error);
    throw new Error(`Failed to update quote: ${error.message}`);
  }

  // Convert the updated quote to a Quote object using the adapter
  return adaptQuote(updatedQuote);
};

// Delete a quote
export const deleteQuoteMutation = async (quoteId: string): Promise<void> => {
  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', quoteId);

  if (error) {
    console.error('Error deleting quote:', error);
    throw new Error(`Failed to delete quote: ${error.message}`);
  }
};

// API to fetch allowances
export const fetchAllowances = async () => {
  const { data, error } = await supabase
    .from('allowances')
    .select('*');

  if (error) {
    console.error('Error fetching allowances:', error);
    throw new Error(`Failed to fetch allowances: ${error.message}`);
  }

  return data;
};

// API to fetch overhead profiles
export const fetchOverheadProfiles = async () => {
  const { data, error } = await supabase
    .from('overhead_profiles')
    .select('*');

  if (error) {
    console.error('Error fetching overhead profiles:', error);
    throw new Error(`Failed to fetch overhead profiles: ${error.message}`);
  }

  return data;
};
