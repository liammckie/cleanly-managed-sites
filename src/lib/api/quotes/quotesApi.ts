
import { supabase } from '@/lib/supabase';
import { adaptQuoteShift, adaptQuoteSubcontractor } from '@/utils/typeAdapters';
import { Quote, QuoteShift, QuoteSubcontractor } from '@/types/models';
import { fetchQuoteShiftsByQuoteId } from './quoteShiftsApi';
import { fetchQuoteSubcontractorsByQuoteId } from './quoteSubcontractorsApi';

/**
 * Fetches all quotes
 */
export async function fetchQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw new Error(`Error fetching quotes: ${error.message}`);
  
  // Convert the data into the shape we need
  const quotes = await Promise.all(
    data.map(async (quote) => {
      // Convert field names to camel case
      const adaptedQuote = {
        id: quote.id,
        name: quote.name,
        client_name: quote.client_name,
        clientName: quote.client_name,
        site_name: quote.site_name,
        siteName: quote.site_name,
        description: quote.description,
        status: quote.status,
        overhead_percentage: quote.overhead_percentage,
        overheadPercentage: quote.overhead_percentage,
        margin_percentage: quote.margin_percentage,
        marginPercentage: quote.margin_percentage,
        total_price: quote.total_price,
        totalPrice: quote.total_price,
        labor_cost: quote.labor_cost,
        laborCost: quote.labor_cost,
        // Add default values for potentially missing properties
        supplies_cost: quote.supplies_cost || 0,
        suppliesCost: quote.supplies_cost || 0,
        equipment_cost: quote.equipment_cost || 0,
        equipmentCost: quote.equipment_cost || 0,
        subcontractor_cost: quote.subcontractor_cost,
        subcontractorCost: quote.subcontractor_cost,
        created_at: quote.created_at,
        createdAt: quote.created_at,
        updated_at: quote.updated_at,
        updatedAt: quote.updated_at,
        quote_number: quote.quote_number,
        quoteNumber: quote.quote_number,
        valid_until: quote.valid_until,
        validUntil: quote.valid_until,
        
        // Additional fields
        notes: quote.notes || '',
        overhead_cost: quote.overhead_cost || 0,
        overheadCost: quote.overhead_cost || 0,
        total_cost: quote.total_cost || 0,
        totalCost: quote.total_cost || 0,
        margin_amount: quote.margin_amount || 0,
        marginAmount: quote.margin_amount || 0,
        
        // Handle optional fields related to client/site
        client_contact: quote.client_contact || '',
        clientContact: quote.client_contact || '',
        client_email: quote.client_email || '',
        clientEmail: quote.client_email || '',
        client_phone: quote.client_phone || '',
        clientPhone: quote.client_phone || '',
        site_address: quote.site_address || '',
        siteAddress: quote.site_address || '',
        frequency: quote.frequency || '',
        scope: quote.scope || '',
        terms: quote.terms || '',
        
        // Dates and contract info
        start_date: quote.start_date,
        startDate: quote.start_date,
        end_date: quote.end_date,
        endDate: quote.end_date,
        expiry_date: quote.expiry_date,
        expiryDate: quote.expiry_date,
        contract_length: quote.contract_length,
        contractLength: quote.contract_length,
        contract_length_unit: quote.contract_length_unit,
        contractLengthUnit: quote.contract_length_unit,
        
        // IDs
        client_id: quote.client_id,
        clientId: quote.client_id,
        site_id: quote.site_id,
        siteId: quote.site_id,
        created_by: quote.created_by,
        createdBy: quote.created_by,
        user_id: quote.user_id,
        userId: quote.user_id,
        
        // Will fetch and set these separately
        shifts: [] as QuoteShift[],
        subcontractors: [] as QuoteSubcontractor[]
      } as Quote;
      
      try {
        // Fetch shifts and subcontractors for this quote
        const [shifts, subcontractors] = await Promise.all([
          fetchQuoteShiftsByQuoteId(quote.id),
          fetchQuoteSubcontractorsByQuoteId(quote.id)
        ]);
        
        adaptedQuote.shifts = shifts;
        adaptedQuote.subcontractors = subcontractors;
      } catch (err) {
        console.error(`Error fetching related data for quote ${quote.id}:`, err);
      }
      
      return adaptedQuote;
    })
  );
  
  return quotes;
}

/**
 * Fetches a single quote by ID
 */
export async function fetchQuote(id: string): Promise<Quote> {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw new Error(`Error fetching quote: ${error.message}`);
  
  // Convert field names to camel case
  const adaptedQuote = {
    id: data.id,
    name: data.name,
    client_name: data.client_name,
    clientName: data.client_name,
    site_name: data.site_name,
    siteName: data.site_name,
    description: data.description,
    status: data.status,
    overhead_percentage: data.overhead_percentage,
    overheadPercentage: data.overhead_percentage,
    margin_percentage: data.margin_percentage,
    marginPercentage: data.margin_percentage,
    total_price: data.total_price,
    totalPrice: data.total_price,
    labor_cost: data.labor_cost,
    laborCost: data.labor_cost,
    // Add default values for potentially missing properties
    supplies_cost: data.supplies_cost || 0,
    suppliesCost: data.supplies_cost || 0,
    equipment_cost: data.equipment_cost || 0,
    equipmentCost: data.equipment_cost || 0,
    subcontractor_cost: data.subcontractor_cost,
    subcontractorCost: data.subcontractor_cost,
    created_at: data.created_at,
    createdAt: data.created_at,
    updated_at: data.updated_at,
    updatedAt: data.updated_at,
    quote_number: data.quote_number,
    quoteNumber: data.quote_number,
    valid_until: data.valid_until,
    validUntil: data.valid_until,
    
    // Additional fields
    notes: data.notes || '',
    overhead_cost: data.overhead_cost || 0,
    overheadCost: data.overhead_cost || 0,
    total_cost: data.total_cost || 0,
    totalCost: data.total_cost || 0,
    margin_amount: data.margin_amount || 0,
    marginAmount: data.margin_amount || 0,
    
    // Handle optional fields related to client/site
    client_contact: data.client_contact || '',
    clientContact: data.client_contact || '',
    client_email: data.client_email || '',
    clientEmail: data.client_email || '',
    client_phone: data.client_phone || '',
    clientPhone: data.client_phone || '',
    site_address: data.site_address || '',
    siteAddress: data.site_address || '',
    frequency: data.frequency || '',
    scope: data.scope || '',
    terms: data.terms || '',
    
    // Dates and contract info
    start_date: data.start_date,
    startDate: data.start_date,
    end_date: data.end_date,
    endDate: data.end_date,
    expiry_date: data.expiry_date,
    expiryDate: data.expiry_date,
    contract_length: data.contract_length,
    contractLength: data.contract_length,
    contract_length_unit: data.contract_length_unit,
    contractLengthUnit: data.contract_length_unit,
    
    // IDs
    client_id: data.client_id,
    clientId: data.client_id,
    site_id: data.site_id,
    siteId: data.site_id,
    created_by: data.created_by,
    createdBy: data.created_by,
    user_id: data.user_id,
    userId: data.user_id,
    
    // Will fetch and set these separately
    shifts: [] as QuoteShift[],
    subcontractors: [] as QuoteSubcontractor[]
  } as Quote;
  
  try {
    // Fetch shifts and subcontractors for this quote
    const [shifts, subcontractors] = await Promise.all([
      fetchQuoteShiftsByQuoteId(data.id),
      fetchQuoteSubcontractorsByQuoteId(data.id)
    ]);
    
    adaptedQuote.shifts = shifts;
    adaptedQuote.subcontractors = subcontractors;
  } catch (err) {
    console.error(`Error fetching related data for quote ${data.id}:`, err);
  }
  
  return adaptedQuote;
}

/**
 * Creates a new quote
 */
export async function createQuoteMutation(quoteData: Partial<Quote>): Promise<Quote> {
  // Handle the conversion from camelCase to snake_case
  const dbQuote = {
    name: quoteData.name,
    client_name: quoteData.clientName || quoteData.client_name,
    site_name: quoteData.siteName || quoteData.site_name,
    description: quoteData.description,
    status: quoteData.status,
    
    // Ensure the fields match what the database expects
    overhead_percentage: quoteData.overheadPercentage || quoteData.overhead_percentage,
    margin_percentage: quoteData.marginPercentage || quoteData.margin_percentage,
    labor_cost: quoteData.laborCost || quoteData.labor_cost || 0,
    supplies_cost: quoteData.suppliesCost || quoteData.supplies_cost,
    equipment_cost: quoteData.equipmentCost || quoteData.equipment_cost,
    subcontractor_cost: quoteData.subcontractorCost || quoteData.subcontractor_cost || 0,
    
    // Additional fields
    notes: quoteData.notes || '',
    overhead_cost: quoteData.overheadCost || quoteData.overhead_cost || 0,
    total_cost: quoteData.totalCost || quoteData.total_cost || 0,
    margin_amount: quoteData.marginAmount || quoteData.margin_amount || 0,
    total_price: quoteData.totalPrice || quoteData.total_price || 0,
    
    // Handle optional fields related to client/site
    client_contact: quoteData.clientContact || quoteData.client_contact,
    client_email: quoteData.clientEmail || quoteData.client_email,
    client_phone: quoteData.clientPhone || quoteData.client_phone,
    site_address: quoteData.siteAddress || quoteData.site_address,
    frequency: quoteData.frequency,
    scope: quoteData.scope,
    terms: quoteData.terms,
    
    // Dates and contract info
    start_date: quoteData.startDate || quoteData.start_date,
    end_date: quoteData.endDate || quoteData.end_date,
    expiry_date: quoteData.expiryDate || quoteData.expiry_date,
    contract_length: quoteData.contractLength || quoteData.contract_length,
    contract_length_unit: quoteData.contractLengthUnit || quoteData.contract_length_unit,
    
    // IDs
    client_id: quoteData.clientId || quoteData.client_id,
    site_id: quoteData.siteId || quoteData.site_id,
    
    // Only include these if present to avoid errors
    ...(quoteData.quote_number && { quote_number: quoteData.quote_number }),
    ...(quoteData.quoteNumber && { quote_number: quoteData.quoteNumber }),
    ...(quoteData.valid_until && { valid_until: quoteData.valid_until }),
    ...(quoteData.validUntil && { valid_until: quoteData.validUntil }),
  };
  
  // Insert into the database
  const { data, error } = await supabase
    .from('quotes')
    .insert(dbQuote)
    .select()
    .single();
    
  if (error) throw new Error(`Error creating quote: ${error.message}`);
  
  const shifts = quoteData.shifts || [];
  const subcontractors = quoteData.subcontractors || [];
  
  // Insert related shifts if any
  if (shifts.length > 0) {
    const dbShifts = shifts.map(shift => ({
      quote_id: data.id,
      day: shift.day,
      start_time: shift.startTime,
      end_time: shift.endTime,
      break_duration: shift.breakDuration,
      number_of_cleaners: shift.numberOfCleaners,
      employment_type: shift.employmentType,
      level: shift.level,
      location: shift.location,
      notes: shift.notes,
      allowances: shift.allowances || [],
      estimated_cost: shift.estimatedCost
    }));
    
    const { error: shiftsError } = await supabase
      .from('quote_shifts')
      .insert(dbShifts);
      
    if (shiftsError) console.error('Error inserting shifts:', shiftsError);
  }
  
  // Insert related subcontractors if any
  if (subcontractors.length > 0) {
    const dbSubcontractors = subcontractors.map(sub => ({
      quote_id: data.id,
      name: sub.name,
      description: sub.description,
      cost: sub.cost,
      frequency: sub.frequency,
      // Additional fields if they exist
      email: sub.email,
      phone: sub.phone,
      service: sub.service,
      notes: sub.notes,
      services: sub.services,
      custom_services: sub.customServices,
      monthly_cost: sub.monthlyCost,
      is_flat_rate: sub.isFlatRate
    }));
    
    const { error: subsError } = await supabase
      .from('quote_subcontractors')
      .insert(dbSubcontractors);
      
    if (subsError) console.error('Error inserting subcontractors:', subsError);
  }
  
  // Return the created quote, including related data
  return fetchQuote(data.id);
}

/**
 * Updates an existing quote
 */
export async function updateQuoteMutation(quoteData: Quote): Promise<Quote> {
  // Extract the ID
  const { id } = quoteData;
  
  // Handle the conversion from camelCase to snake_case
  const dbQuote = {
    name: quoteData.name,
    client_name: quoteData.clientName || quoteData.client_name,
    site_name: quoteData.siteName || quoteData.site_name,
    description: quoteData.description,
    status: quoteData.status,
    
    // Ensure the fields match what the database expects
    overhead_percentage: quoteData.overheadPercentage || quoteData.overhead_percentage,
    margin_percentage: quoteData.marginPercentage || quoteData.margin_percentage,
    labor_cost: quoteData.laborCost || quoteData.labor_cost || 0,
    supplies_cost: quoteData.suppliesCost || quoteData.supplies_cost,
    equipment_cost: quoteData.equipmentCost || quoteData.equipment_cost,
    subcontractor_cost: quoteData.subcontractorCost || quoteData.subcontractor_cost || 0,
    
    // Additional fields
    notes: quoteData.notes || '',
    overhead_cost: quoteData.overheadCost || quoteData.overhead_cost || 0,
    total_cost: quoteData.totalCost || quoteData.total_cost || 0,
    margin_amount: quoteData.marginAmount || quoteData.margin_amount || 0,
    total_price: quoteData.totalPrice || quoteData.total_price || 0,
    
    // Handle optional fields related to client/site
    client_contact: quoteData.clientContact || quoteData.client_contact,
    client_email: quoteData.clientEmail || quoteData.client_email,
    client_phone: quoteData.clientPhone || quoteData.client_phone,
    site_address: quoteData.siteAddress || quoteData.site_address,
    frequency: quoteData.frequency,
    scope: quoteData.scope,
    terms: quoteData.terms,
    
    // Dates and contract info
    start_date: quoteData.startDate || quoteData.start_date,
    end_date: quoteData.endDate || quoteData.end_date,
    expiry_date: quoteData.expiryDate || quoteData.expiry_date,
    contract_length: quoteData.contractLength || quoteData.contract_length,
    contract_length_unit: quoteData.contractLengthUnit || quoteData.contract_length_unit,
    
    // IDs
    client_id: quoteData.clientId || quoteData.client_id,
    site_id: quoteData.siteId || quoteData.site_id,
    
    // Only include these if present to avoid errors
    ...(quoteData.quote_number && { quote_number: quoteData.quote_number }),
    ...(quoteData.quoteNumber && { quote_number: quoteData.quoteNumber }),
    ...(quoteData.valid_until && { valid_until: quoteData.valid_until }),
    ...(quoteData.validUntil && { valid_until: quoteData.validUntil }),
  };
  
  // Update the quote
  const { data, error } = await supabase
    .from('quotes')
    .update(dbQuote)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw new Error(`Error updating quote: ${error.message}`);
  
  // Handle shifts: delete existing ones and insert new ones
  if (quoteData.shifts) {
    // Delete existing shifts
    await supabase
      .from('quote_shifts')
      .delete()
      .eq('quote_id', id);
    
    // Insert new shifts
    const dbShifts = quoteData.shifts.map(shift => ({
      quote_id: id,
      day: shift.day,
      start_time: shift.startTime,
      end_time: shift.endTime,
      break_duration: shift.breakDuration,
      number_of_cleaners: shift.numberOfCleaners,
      employment_type: shift.employmentType,
      level: shift.level,
      location: shift.location,
      notes: shift.notes,
      allowances: shift.allowances || [],
      estimated_cost: shift.estimatedCost
    }));
    
    if (dbShifts.length > 0) {
      const { error: shiftsError } = await supabase
        .from('quote_shifts')
        .insert(dbShifts);
        
      if (shiftsError) console.error('Error inserting shifts:', shiftsError);
    }
  }
  
  // Handle subcontractors: delete existing ones and insert new ones
  if (quoteData.subcontractors) {
    // Delete existing subcontractors
    await supabase
      .from('quote_subcontractors')
      .delete()
      .eq('quote_id', id);
    
    // Insert new subcontractors
    const dbSubcontractors = quoteData.subcontractors.map(sub => ({
      quote_id: id,
      name: sub.name,
      description: sub.description,
      cost: sub.cost,
      frequency: sub.frequency,
      // Additional fields if they exist
      email: sub.email,
      phone: sub.phone,
      service: sub.service,
      notes: sub.notes,
      services: sub.services,
      custom_services: sub.customServices,
      monthly_cost: sub.monthlyCost,
      is_flat_rate: sub.isFlatRate
    }));
    
    if (dbSubcontractors.length > 0) {
      const { error: subsError } = await supabase
        .from('quote_subcontractors')
        .insert(dbSubcontractors);
        
      if (subsError) console.error('Error inserting subcontractors:', subsError);
    }
  }
  
  // Return the updated quote, including related data
  return fetchQuote(id);
}

/**
 * Deletes a quote
 */
export async function deleteQuoteMutation(id: string): Promise<void> {
  // First, delete related data
  await Promise.all([
    supabase.from('quote_shifts').delete().eq('quote_id', id),
    supabase.from('quote_subcontractors').delete().eq('quote_id', id)
  ]);
  
  // Then delete the quote itself
  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', id);
    
  if (error) throw new Error(`Error deleting quote: ${error.message}`);
}
