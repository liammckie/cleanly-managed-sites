
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Quote, QuoteShift, Subcontractor } from '@/lib/award/types';

// Fetch quotes from Supabase
const fetchQuotes = async () => {
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
const fetchQuote = async (quoteId: string) => {
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
const createQuoteMutation = async (quoteData: Partial<Quote>) => {
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
      // We don't throw here to avoid rolling back the entire transaction
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
const updateQuoteMutation = async (quoteData: Quote) => {
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
const deleteQuoteMutation = async (quoteId: string) => {
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

// Fetch allowances
const fetchAllowances = async () => {
  const { data, error } = await supabase
    .from('allowances')
    .select('*');
  
  if (error) {
    console.error('Error fetching allowances:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Fetch overhead profiles
const fetchOverheadProfiles = async () => {
  const { data, error } = await supabase
    .from('overhead_profiles')
    .select('*');
  
  if (error) {
    console.error('Error fetching overhead profiles:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// React Query hooks
export function useAllowances() {
  return useQuery({
    queryKey: ['allowances'],
    queryFn: fetchAllowances,
  });
}

export function useOverheadProfiles() {
  return useQuery({
    queryKey: ['overhead-profiles'],
    queryFn: fetchOverheadProfiles,
  });
}

export function useQuotes() {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
  });
}

export function useQuote(quoteId: string) {
  return useQuery({
    queryKey: ['quote', quoteId],
    queryFn: () => fetchQuote(quoteId),
    enabled: !!quoteId,
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createQuoteMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create quote: ' + error.message);
    }
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateQuoteMutation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quote', data.id] });
      toast.success('Quote updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update quote: ' + error.message);
    }
  });
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteQuoteMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete quote: ' + error.message);
    }
  });
}
