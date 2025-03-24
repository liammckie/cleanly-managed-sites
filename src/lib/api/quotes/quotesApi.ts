
import { supabase } from '@/lib/supabase';
import { Quote } from '@/lib/award/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { 
  DbQuote, 
  dbToQuote, 
  quoteToDb, 
  quoteShiftToDb, 
  subcontractorToDb, 
  dbToQuoteShift,
  dbToSubcontractor
} from './adapters';

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
  
  return (data || []).map((item) => dbToQuote(item as DbQuote));
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
  
  // Create enhanced quote object with all related data
  const fullQuote = dbToQuote(quote as DbQuote);
  
  // Add shifts and subcontractors
  fullQuote.shifts = (shifts || []).map(shift => dbToQuoteShift(shift as any));
  fullQuote.subcontractors = (subcontractors || []).map(sub => dbToSubcontractor(sub as any));
  
  return fullQuote;
};

// Create a new quote
export const createQuoteMutation = async (quoteData: Partial<Quote>) => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const { shifts, subcontractors, ...restQuoteData } = quoteData as any;
  
  const newQuote: Quote = {
    ...restQuoteData,
    id: restQuoteData.id || uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId, // Use userId property from Quote type
    created_by: userId
  } as Quote;
  
  const dbQuoteData = quoteToDb(newQuote);
  
  // Ensure name is present as it's required
  if (!dbQuoteData.name) {
    throw new Error('Quote name is required');
  }

  // Create a valid object for Supabase insert with all required fields
  const validQuoteData = {
    id: dbQuoteData.id,
    name: dbQuoteData.name, // Required field
    client_name: dbQuoteData.client_name || '',
    site_name: dbQuoteData.site_name || '',
    status: dbQuoteData.status || 'draft',
    start_date: dbQuoteData.start_date,
    end_date: dbQuoteData.end_date,
    expiry_date: dbQuoteData.expiry_date,
    contract_length: dbQuoteData.contract_length,
    contract_length_unit: dbQuoteData.contract_length_unit,
    overhead_profile: dbQuoteData.overhead_profile,
    overhead_percentage: dbQuoteData.overhead_percentage || 15,
    margin_percentage: dbQuoteData.margin_percentage || 20,
    notes: dbQuoteData.notes,
    labor_cost: dbQuoteData.labor_cost || 0,
    overhead_cost: dbQuoteData.overhead_cost || 0,
    subcontractor_cost: dbQuoteData.subcontractor_cost || 0,
    total_cost: dbQuoteData.total_cost || 0,
    margin_amount: dbQuoteData.margin_amount || 0,
    total_price: dbQuoteData.total_price || 0,
    created_by: dbQuoteData.created_by,
    user_id: dbQuoteData.user_id || userId,
    supplies_cost: dbQuoteData.supplies_cost || 0,
    equipment_cost: dbQuoteData.equipment_cost || 0,
  };
  
  // Insert the quote
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .insert([validQuoteData])
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
    for (const shift of shifts) {
      const completeShift: QuoteShift = {
        ...shift,
        id: shift.id || uuidv4(),
        quoteId: quote.id
      } as QuoteShift;
      
      const shiftWithQuoteId = quoteShiftToDb(completeShift);
      
      // Ensure required fields
      if (!shiftWithQuoteId.day || !shiftWithQuoteId.employment_type || 
          !shiftWithQuoteId.start_time || !shiftWithQuoteId.end_time ||
          !shiftWithQuoteId.level) {
        console.error('Missing required fields for shift:', shiftWithQuoteId);
        continue;
      }
      
      // Create a valid object for Supabase insert
      const validShiftData = {
        id: shiftWithQuoteId.id,
        quote_id: shiftWithQuoteId.quote_id,
        day: shiftWithQuoteId.day,
        start_time: shiftWithQuoteId.start_time,
        end_time: shiftWithQuoteId.end_time,
        break_duration: shiftWithQuoteId.break_duration || 0,
        level: shiftWithQuoteId.level,
        employment_type: shiftWithQuoteId.employment_type,
        number_of_cleaners: shiftWithQuoteId.number_of_cleaners || 1,
        location: shiftWithQuoteId.location || '',
        allowances: shiftWithQuoteId.allowances || [],
        estimated_cost: shiftWithQuoteId.estimated_cost || 0,
        notes: shiftWithQuoteId.notes || ''
      };
      
      const { error: shiftError } = await supabase
        .from('quote_shifts')
        .insert([validShiftData]);
      
      if (shiftError) {
        console.error('Error adding shift:', shiftError);
        toast.error('Error adding shift: ' + shiftError.message);
      }
    }
  }
  
  // If subcontractors are provided, insert them
  if (subcontractors && subcontractors.length > 0) {
    for (const subcontractor of subcontractors) {
      const completeSubcontractor: Subcontractor = {
        ...subcontractor,
        id: subcontractor.id || uuidv4(),
        quoteId: quote.id
      } as Subcontractor;
      
      const subWithQuoteId = subcontractorToDb(completeSubcontractor);
      
      // Ensure name is present
      if (!subWithQuoteId.name) {
        console.error('Missing name for subcontractor:', subWithQuoteId);
        continue;
      }
      
      // Create a valid object for Supabase insert
      const validSubData = {
        id: subWithQuoteId.id,
        quote_id: subWithQuoteId.quote_id,
        name: subWithQuoteId.name,
        services: subWithQuoteId.services || [],
        description: subWithQuoteId.description || '',
        frequency: subWithQuoteId.frequency || 'monthly',
        cost: subWithQuoteId.cost || 0,
        email: subWithQuoteId.email || '',
        phone: subWithQuoteId.phone || '',
        notes: subWithQuoteId.notes || ''
      };
      
      const { error: subError } = await supabase
        .from('quote_subcontractors')
        .insert([validSubData]);
      
      if (subError) {
        console.error('Error adding subcontractor:', subError);
        toast.error('Error adding subcontractor: ' + subError.message);
      }
    }
  }
  
  return dbToQuote(quote as DbQuote);
};

// Update an existing quote
export const updateQuoteMutation = async (quoteData: Quote) => {
  const { id, shifts, subcontractors, ...restQuoteData } = quoteData;
  
  if (!id) {
    throw new Error('Quote ID is required for updates');
  }
  
  const updatedQuote: Quote = {
    ...restQuoteData,
    id,
    updatedAt: new Date().toISOString()
  } as Quote;
  
  const dbQuoteData = quoteToDb(updatedQuote);
  
  // Ensure name is present
  if (!dbQuoteData.name) {
    throw new Error('Quote name is required');
  }
  
  // Update quote details
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .update(dbQuoteData)
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
      for (const shift of shifts) {
        const completeShift: QuoteShift = {
          ...shift,
          id: shift.id || uuidv4(),
          quoteId: id
        } as QuoteShift;
        
        const shiftWithQuoteId = quoteShiftToDb(completeShift);
        
        // Ensure required fields
        if (!shiftWithQuoteId.day || !shiftWithQuoteId.employment_type || 
            !shiftWithQuoteId.start_time || !shiftWithQuoteId.end_time ||
            !shiftWithQuoteId.level) {
          console.error('Missing required fields for shift:', shiftWithQuoteId);
          continue;
        }
        
        // Create a valid object for Supabase insert
        const validShiftData = {
          id: shiftWithQuoteId.id,
          quote_id: shiftWithQuoteId.quote_id,
          day: shiftWithQuoteId.day,
          start_time: shiftWithQuoteId.start_time,
          end_time: shiftWithQuoteId.end_time,
          break_duration: shiftWithQuoteId.break_duration || 0,
          level: shiftWithQuoteId.level,
          employment_type: shiftWithQuoteId.employment_type,
          number_of_cleaners: shiftWithQuoteId.number_of_cleaners || 1,
          location: shiftWithQuoteId.location || '',
          allowances: shiftWithQuoteId.allowances || [],
          estimated_cost: shiftWithQuoteId.estimated_cost || 0,
          notes: shiftWithQuoteId.notes || ''
        };
        
        const { error: addShiftError } = await supabase
          .from('quote_shifts')
          .insert([validShiftData]);
        
        if (addShiftError) {
          console.error('Error adding shift:', addShiftError);
          toast.error('Error updating shifts: ' + addShiftError.message);
        }
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
      for (const subcontractor of subcontractors) {
        const completeSubcontractor: Subcontractor = {
          ...subcontractor,
          id: subcontractor.id || uuidv4(),
          quoteId: id
        } as Subcontractor;
        
        const subWithQuoteId = subcontractorToDb(completeSubcontractor);
        
        // Ensure name is present
        if (!subWithQuoteId.name) {
          console.error('Missing name for subcontractor:', subWithQuoteId);
          continue;
        }
        
        // Create a valid object for Supabase insert
        const validSubData = {
          id: subWithQuoteId.id,
          quote_id: subWithQuoteId.quote_id,
          name: subWithQuoteId.name,
          services: subWithQuoteId.services || [],
          description: subWithQuoteId.description || '',
          frequency: subWithQuoteId.frequency || 'monthly',
          cost: subWithQuoteId.cost || 0,
          email: subWithQuoteId.email || '',
          phone: subWithQuoteId.phone || '',
          notes: subWithQuoteId.notes || ''
        };
        
        const { error: addSubError } = await supabase
          .from('quote_subcontractors')
          .insert([validSubData]);
        
        if (addSubError) {
          console.error('Error adding subcontractor:', addSubError);
          toast.error('Error updating subcontractors: ' + addSubError.message);
        }
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
