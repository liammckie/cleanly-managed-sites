
import { supabase } from '@/lib/supabase';
import { Quote } from '@/lib/award/types';
import { toast } from 'sonner';

// Fetch quotes from Supabase
export const fetchQuotes = async () => {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching quotes:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Fetch a single quote with its shifts and subcontractors
export const fetchQuote = async (quoteId: string) => {
  if (!quoteId) throw new Error('Quote ID is required');
  
  // Fetch the quote
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .single();
  
  if (quoteError) {
    console.error('Error fetching quote:', quoteError);
    throw new Error(quoteError.message);
  }
  
  if (!quote) {
    throw new Error(`Quote with ID ${quoteId} not found`);
  }
  
  // Fetch shifts for this quote
  const { data: shifts, error: shiftsError } = await supabase
    .from('quote_shifts')
    .select('*')
    .eq('quote_id', quoteId);
  
  if (shiftsError) {
    console.error('Error fetching shifts:', shiftsError);
    throw new Error(shiftsError.message);
  }
  
  // Fetch subcontractors for this quote
  const { data: subcontractors, error: subcontractorsError } = await supabase
    .from('quote_subcontractors')
    .select('*')
    .eq('quote_id', quoteId);
  
  if (subcontractorsError) {
    console.error('Error fetching subcontractors:', subcontractorsError);
    throw new Error(subcontractorsError.message);
  }
  
  // Combine all data into a quote object
  return {
    ...quote,
    shifts: shifts || [],
    subcontractors: subcontractors || []
  };
};

// Create a new quote
export const createQuoteMutation = async (quoteData: Partial<Quote>) => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const { shifts, subcontractors, ...quoteDetails } = quoteData;
  
  // Insert the quote
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .insert([{ ...quoteDetails, user_id: userId, created_by: userId }])
    .select()
    .single();
  
  if (quoteError) {
    console.error('Error creating quote:', quoteError);
    throw new Error(quoteError.message);
  }
  
  if (!quote) {
    throw new Error('Failed to create quote');
  }
  
  // If shifts are provided, insert them
  if (shifts && shifts.length > 0) {
    const shiftsWithQuoteId = shifts.map(shift => ({
      ...shift,
      quote_id: quote.id
    }));
    
    const { error: shiftsError } = await supabase
      .from('quote_shifts')
      .insert(shiftsWithQuoteId);
    
    if (shiftsError) {
      console.error('Error adding shifts:', shiftsError);
      toast.error('Error adding shifts: ' + shiftsError.message);
    }
  }
  
  // If subcontractors are provided, insert them
  if (subcontractors && subcontractors.length > 0) {
    const subcontractorsWithQuoteId = subcontractors.map(subcontractor => ({
      ...subcontractor,
      quote_id: quote.id
    }));
    
    const { error: subcontractorsError } = await supabase
      .from('quote_subcontractors')
      .insert(subcontractorsWithQuoteId);
    
    if (subcontractorsError) {
      console.error('Error adding subcontractors:', subcontractorsError);
      toast.error('Error adding subcontractors: ' + subcontractorsError.message);
    }
  }
  
  return quote;
};

// Update an existing quote
export const updateQuoteMutation = async (quoteData: Quote) => {
  const { id, shifts, subcontractors, ...quoteDetails } = quoteData;
  
  if (!id) {
    throw new Error('Quote ID is required for updates');
  }
  
  // Update quote details
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .update({ ...quoteDetails, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (quoteError) {
    console.error('Error updating quote:', quoteError);
    throw new Error(quoteError.message);
  }
  
  // If shifts are provided, delete existing ones and insert new ones
  if (shifts) {
    // Delete existing shifts
    const { error: deleteShiftsError } = await supabase
      .from('quote_shifts')
      .delete()
      .eq('quote_id', id);
    
    if (deleteShiftsError) {
      console.error('Error deleting shifts:', deleteShiftsError);
      toast.error('Error updating shifts: ' + deleteShiftsError.message);
    }
    
    // Insert new shifts if there are any
    if (shifts.length > 0) {
      const shiftsWithQuoteId = shifts.map(shift => ({
        ...shift,
        quote_id: id
      }));
      
      const { error: addShiftsError } = await supabase
        .from('quote_shifts')
        .insert(shiftsWithQuoteId);
      
      if (addShiftsError) {
        console.error('Error adding shifts:', addShiftsError);
        toast.error('Error updating shifts: ' + addShiftsError.message);
      }
    }
  }
  
  // If subcontractors are provided, delete existing ones and insert new ones
  if (subcontractors) {
    // Delete existing subcontractors
    const { error: deleteSubcontractorsError } = await supabase
      .from('quote_subcontractors')
      .delete()
      .eq('quote_id', id);
    
    if (deleteSubcontractorsError) {
      console.error('Error deleting subcontractors:', deleteSubcontractorsError);
      toast.error('Error updating subcontractors: ' + deleteSubcontractorsError.message);
    }
    
    // Insert new subcontractors if there are any
    if (subcontractors.length > 0) {
      const subcontractorsWithQuoteId = subcontractors.map(subcontractor => ({
        ...subcontractor,
        quote_id: id
      }));
      
      const { error: addSubcontractorsError } = await supabase
        .from('quote_subcontractors')
        .insert(subcontractorsWithQuoteId);
      
      if (addSubcontractorsError) {
        console.error('Error adding subcontractors:', addSubcontractorsError);
        toast.error('Error updating subcontractors: ' + addSubcontractorsError.message);
      }
    }
  }
  
  // Fetch the updated quote with shifts and subcontractors
  return fetchQuote(id);
};

// Delete a quote
export const deleteQuoteMutation = async (quoteId: string) => {
  if (!quoteId) {
    throw new Error('Quote ID is required for deletion');
  }
  
  // Delete the quote (shifts and subcontractors will be deleted automatically due to CASCADE)
  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', quoteId);
  
  if (error) {
    console.error('Error deleting quote:', error);
    throw new Error(error.message);
  }
  
  return { success: true, id: quoteId };
};
