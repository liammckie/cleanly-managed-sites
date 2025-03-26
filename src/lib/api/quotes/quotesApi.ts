
import { supabase } from '@/lib/supabase';
import { Quote, QuoteShift, QuoteSubcontractor } from '@/lib/types/quoteTypes';
import { QuoteSubcontractor as Subcontractor } from '@/types/models';
import { adaptQuote } from '@/utils/typeAdapters';

// Fetch all quotes
export const fetchQuotes = async (): Promise<Quote[]> => {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching quotes: ${error.message}`);
  }

  return data.map((quote) => {
    // Convert snake_case to camelCase for client-side usage
    return {
      id: quote.id,
      name: quote.name,
      client_name: quote.client_name,
      clientName: quote.client_name,
      site_name: quote.site_name || '',
      siteName: quote.site_name || '',
      status: quote.status,
      overhead_percentage: quote.overhead_percentage,
      overheadPercentage: quote.overhead_percentage,
      margin_percentage: quote.margin_percentage,
      marginPercentage: quote.margin_percentage,
      total_price: quote.total_price,
      totalPrice: quote.total_price,
      labor_cost: quote.labor_cost,
      laborCost: quote.labor_cost,
      supplies_cost: quote.supplies_cost || 0,
      suppliesCost: quote.supplies_cost || 0,
      equipment_cost: quote.equipment_cost || 0,
      equipmentCost: quote.equipment_cost || 0,
      subcontractor_cost: quote.subcontractor_cost,
      subcontractorCost: quote.subcontractor_cost,
      overhead_cost: quote.overhead_cost || 0,
      overheadCost: quote.overhead_cost || 0,
      margin_amount: quote.margin_amount || 0,
      marginAmount: quote.margin_amount || 0,
      total_cost: quote.total_cost || 0,
      totalCost: quote.total_cost || 0,
      created_at: quote.created_at,
      createdAt: quote.created_at,
      updated_at: quote.updated_at,
      updatedAt: quote.updated_at,
      notes: quote.notes || '',
      clientContact: quote.client_contact || '',
      clientEmail: quote.client_email || '',
      clientPhone: quote.client_phone || '',
      siteAddress: quote.site_address || '',
      frequency: quote.frequency || '',
      scope: quote.scope || '',
      terms: quote.terms || '',
      startDate: quote.start_date || '',
      endDate: quote.end_date || '',
      expiryDate: quote.expiry_date || '',
      contractLength: quote.contract_length || 0,
      contractLengthUnit: quote.contract_length_unit as any,
      clientId: quote.client_id || '',
      siteId: quote.site_id || '',
    } as Quote;
  });
};

// Fetch a single quote by ID, including shifts and subcontractors
export const fetchQuote = async (quoteId: string): Promise<Quote> => {
  // Fetch quote details
  const { data: quoteData, error: quoteError } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .single();

  if (quoteError) {
    throw new Error(`Error fetching quote: ${quoteError.message}`);
  }

  // Fetch shifts for this quote
  const { data: shiftsData, error: shiftsError } = await supabase
    .from('quote_shifts')
    .select('*')
    .eq('quote_id', quoteId);

  if (shiftsError) {
    throw new Error(`Error fetching quote shifts: ${shiftsError.message}`);
  }

  // Fetch subcontractors for this quote
  const { data: subcontractorsData, error: subcontractorsError } = await supabase
    .from('quote_subcontractors')
    .select('*')
    .eq('quote_id', quoteId);

  if (subcontractorsError) {
    throw new Error(`Error fetching quote subcontractors: ${subcontractorsError.message}`);
  }

  // Map shifts to the client-side format
  const shifts = shiftsData.map((shift) => ({
    id: shift.id,
    quoteId: shift.quote_id,
    day: shift.day,
    startTime: shift.start_time,
    endTime: shift.end_time,
    breakDuration: shift.break_duration,
    numberOfCleaners: shift.number_of_cleaners,
    employmentType: shift.employment_type,
    level: shift.level,
    allowances: shift.allowances || [],
    estimatedCost: shift.estimated_cost,
    location: shift.location || '',
    notes: shift.notes || '',
  })) as QuoteShift[];

  // Map subcontractors to the client-side format
  const subcontractors = subcontractorsData.map((sub) => ({
    id: sub.id,
    quoteId: sub.quote_id,
    name: sub.name,
    description: sub.description || '',
    cost: sub.cost,
    frequency: sub.frequency,
    email: sub.email || '',
    phone: sub.phone || '',
    notes: sub.notes || '',
    service: sub.service || '',
    customServices: sub.custom_services || '',
    monthlyCost: sub.monthly_cost || 0,
    isFlatRate: sub.is_flat_rate || false,
  })) as QuoteSubcontractor[];

  // Combine everything into a quote object
  const quote: Quote = {
    id: quoteData.id,
    name: quoteData.name,
    client_name: quoteData.client_name,
    clientName: quoteData.client_name,
    site_name: quoteData.site_name || '',
    siteName: quoteData.site_name || '',
    status: quoteData.status,
    overhead_percentage: quoteData.overhead_percentage,
    overheadPercentage: quoteData.overhead_percentage,
    margin_percentage: quoteData.margin_percentage,
    marginPercentage: quoteData.margin_percentage,
    total_price: quoteData.total_price,
    totalPrice: quoteData.total_price,
    labor_cost: quoteData.labor_cost,
    laborCost: quoteData.labor_cost,
    supplies_cost: quoteData.supplies_cost || 0,
    suppliesCost: quoteData.supplies_cost || 0,
    equipment_cost: quoteData.equipment_cost || 0,
    equipmentCost: quoteData.equipment_cost || 0,
    subcontractor_cost: quoteData.subcontractor_cost,
    subcontractorCost: quoteData.subcontractor_cost,
    overhead_cost: quoteData.overhead_cost || 0,
    overheadCost: quoteData.overhead_cost || 0,
    margin_amount: quoteData.margin_amount || 0,
    marginAmount: quoteData.margin_amount || 0,
    total_cost: quoteData.total_cost || 0,
    totalCost: quoteData.total_cost || 0,
    created_at: quoteData.created_at,
    createdAt: quoteData.created_at,
    updated_at: quoteData.updated_at,
    updatedAt: quoteData.updated_at,
    notes: quoteData.notes || '',
    clientContact: quoteData.client_contact || '',
    clientEmail: quoteData.client_email || '',
    clientPhone: quoteData.client_phone || '',
    siteAddress: quoteData.site_address || '',
    frequency: quoteData.frequency || '',
    scope: quoteData.scope || '',
    terms: quoteData.terms || '',
    startDate: quoteData.start_date || '',
    endDate: quoteData.end_date || '',
    expiryDate: quoteData.expiry_date || '',
    contractLength: quoteData.contract_length || 0,
    contractLengthUnit: quoteData.contract_length_unit as any,
    clientId: quoteData.client_id || '',
    siteId: quoteData.site_id || '',
    shifts,
    subcontractors,
  };

  return quote;
};

// Create a new quote
export const createQuoteMutation = async (quoteData: Partial<Quote>): Promise<Quote> => {
  // Convert camelCase to snake_case for database storage
  const dbQuote = {
    name: quoteData.name,
    client_name: quoteData.clientName || quoteData.client_name,
    site_name: quoteData.siteName || quoteData.site_name,
    status: quoteData.status || 'draft',
    overhead_percentage: quoteData.overheadPercentage || quoteData.overhead_percentage || 15,
    margin_percentage: quoteData.marginPercentage || quoteData.margin_percentage || 20,
    labor_cost: quoteData.laborCost || quoteData.labor_cost || 0,
    supplies_cost: quoteData.suppliesCost || quoteData.supplies_cost || 0,
    equipment_cost: quoteData.equipmentCost || quoteData.equipment_cost || 0,
    subcontractor_cost: quoteData.subcontractorCost || quoteData.subcontractor_cost || 0,
    overhead_cost: quoteData.overheadCost || quoteData.overhead_cost || 0,
    margin_amount: quoteData.marginAmount || quoteData.margin_amount || 0,
    total_cost: quoteData.totalCost || quoteData.total_cost || 0,
    total_price: quoteData.totalPrice || quoteData.total_price || 0,
    notes: quoteData.notes || '',
    client_contact: quoteData.clientContact || '',
    client_email: quoteData.clientEmail || '',
    client_phone: quoteData.clientPhone || '',
    site_address: quoteData.siteAddress || '',
    frequency: quoteData.frequency || 'weekly',
    scope: quoteData.scope || '',
    terms: quoteData.terms || '',
    start_date: quoteData.startDate || quoteData.start_date || null,
    end_date: quoteData.endDate || quoteData.end_date || null,
    expiry_date: quoteData.expiryDate || quoteData.expiry_date || null,
    contract_length: quoteData.contractLength || quoteData.contract_length || null,
    contract_length_unit: quoteData.contractLengthUnit || quoteData.contract_length_unit || null,
    client_id: quoteData.clientId || quoteData.client_id || null,
    site_id: quoteData.siteId || quoteData.site_id || null,
  };

  // Insert the quote into the database
  const { data: newQuote, error } = await supabase
    .from('quotes')
    .insert(dbQuote)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Error creating quote: ${error.message}`);
  }

  // Handle shifts if provided
  if (quoteData.shifts && quoteData.shifts.length > 0) {
    // Prepare shifts data
    const shiftsToInsert = quoteData.shifts.map((shift) => ({
      quote_id: newQuote.id,
      day: shift.day,
      start_time: shift.startTime,
      end_time: shift.endTime,
      break_duration: shift.breakDuration,
      number_of_cleaners: shift.numberOfCleaners,
      employment_type: shift.employmentType,
      level: shift.level,
      allowances: shift.allowances || [],
      estimated_cost: shift.estimatedCost || 0,
      location: shift.location || '',
      notes: shift.notes || '',
    }));

    // Insert shifts
    const { error: shiftsError } = await supabase
      .from('quote_shifts')
      .insert(shiftsToInsert);

    if (shiftsError) {
      throw new Error(`Error creating quote shifts: ${shiftsError.message}`);
    }
  }

  // Handle subcontractors if provided
  if (quoteData.subcontractors && quoteData.subcontractors.length > 0) {
    // Prepare subcontractors data
    const subsToInsert = quoteData.subcontractors.map((sub) => ({
      quote_id: newQuote.id,
      name: sub.name,
      description: sub.description || '',
      cost: sub.cost,
      frequency: sub.frequency || 'monthly',
      email: sub.email || '',
      phone: sub.phone || '',
      service: sub.service || '',
      notes: sub.notes || '',
      custom_services: sub.customServices || '',
      monthly_cost: sub.monthlyCost || 0,
      is_flat_rate: sub.isFlatRate ?? true,
    }));

    // Insert subcontractors
    const { error: subsError } = await supabase
      .from('quote_subcontractors')
      .insert(subsToInsert);

    if (subsError) {
      throw new Error(`Error creating quote subcontractors: ${subsError.message}`);
    }
  }

  // Fetch the newly created quote with all related data
  return await fetchQuote(newQuote.id);
};

// Update an existing quote
export const updateQuoteMutation = async (quoteData: Quote): Promise<Quote> => {
  // Convert camelCase to snake_case for database storage
  const dbQuote = {
    name: quoteData.name,
    client_name: quoteData.clientName || quoteData.client_name,
    site_name: quoteData.siteName || quoteData.site_name,
    status: quoteData.status,
    overhead_percentage: quoteData.overheadPercentage || quoteData.overhead_percentage,
    margin_percentage: quoteData.marginPercentage || quoteData.margin_percentage,
    labor_cost: quoteData.laborCost || quoteData.labor_cost,
    supplies_cost: quoteData.suppliesCost || quoteData.supplies_cost,
    equipment_cost: quoteData.equipmentCost || quoteData.equipment_cost,
    subcontractor_cost: quoteData.subcontractorCost || quoteData.subcontractor_cost,
    overhead_cost: quoteData.overheadCost || quoteData.overhead_cost,
    margin_amount: quoteData.marginAmount || quoteData.margin_amount,
    total_cost: quoteData.totalCost || quoteData.total_cost,
    total_price: quoteData.totalPrice || quoteData.total_price,
    notes: quoteData.notes,
    client_contact: quoteData.clientContact || '',
    client_email: quoteData.clientEmail || '',
    client_phone: quoteData.clientPhone || '',
    site_address: quoteData.siteAddress || '',
    frequency: quoteData.frequency || 'weekly',
    scope: quoteData.scope || '',
    terms: quoteData.terms || '',
    start_date: quoteData.startDate || quoteData.start_date || null,
    end_date: quoteData.endDate || quoteData.end_date || null,
    expiry_date: quoteData.expiryDate || quoteData.expiry_date || null,
    contract_length: quoteData.contractLength || quoteData.contract_length || null,
    contract_length_unit: quoteData.contractLengthUnit || quoteData.contract_length_unit || null,
    client_id: quoteData.clientId || quoteData.client_id || null,
    site_id: quoteData.siteId || quoteData.site_id || null,
  };

  // Update the quote in the database
  const { data: updatedQuote, error } = await supabase
    .from('quotes')
    .update(dbQuote)
    .eq('id', quoteData.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Error updating quote: ${error.message}`);
  }

  // Handle shifts if provided
  if (quoteData.shifts) {
    // First, delete all existing shifts for this quote
    const { error: deleteShiftsError } = await supabase
      .from('quote_shifts')
      .delete()
      .eq('quote_id', quoteData.id);

    if (deleteShiftsError) {
      throw new Error(`Error deleting existing shifts: ${deleteShiftsError.message}`);
    }

    // Then insert the new shifts if there are any
    if (quoteData.shifts.length > 0) {
      const shiftsToInsert = quoteData.shifts.map((shift) => ({
        quote_id: quoteData.id,
        day: shift.day,
        start_time: shift.startTime,
        end_time: shift.endTime,
        break_duration: shift.breakDuration,
        number_of_cleaners: shift.numberOfCleaners,
        employment_type: shift.employmentType,
        level: shift.level,
        allowances: shift.allowances || [],
        estimated_cost: shift.estimatedCost || 0,
        location: shift.location || '',
        notes: shift.notes || '',
      }));

      const { error: insertShiftsError } = await supabase
        .from('quote_shifts')
        .insert(shiftsToInsert);

      if (insertShiftsError) {
        throw new Error(`Error creating new shifts: ${insertShiftsError.message}`);
      }
    }
  }

  // Handle subcontractors if provided
  if (quoteData.subcontractors) {
    // First, delete all existing subcontractors for this quote
    const { error: deleteSubsError } = await supabase
      .from('quote_subcontractors')
      .delete()
      .eq('quote_id', quoteData.id);

    if (deleteSubsError) {
      throw new Error(`Error deleting existing subcontractors: ${deleteSubsError.message}`);
    }

    // Then insert the new subcontractors if there are any
    if (quoteData.subcontractors.length > 0) {
      const subsToInsert = quoteData.subcontractors.map((sub) => ({
        quote_id: quoteData.id,
        name: sub.name,
        description: sub.description || '',
        cost: sub.cost,
        frequency: sub.frequency || 'monthly',
        email: sub.email || '',
        phone: sub.phone || '',
        service: sub.service || '',
        notes: sub.notes || '',
        custom_services: sub.customServices || '',
        monthly_cost: sub.monthlyCost || 0,
        is_flat_rate: sub.isFlatRate ?? true,
      }));

      const { error: insertSubsError } = await supabase
        .from('quote_subcontractors')
        .insert(subsToInsert);

      if (insertSubsError) {
        throw new Error(`Error creating new subcontractors: ${insertSubsError.message}`);
      }
    }
  }

  // Fetch the updated quote with all related data
  return await fetchQuote(quoteData.id);
};

// Delete a quote
export const deleteQuoteMutation = async (quoteId: string): Promise<void> => {
  // First delete related records (triggers cascade delete, but we'll be explicit)
  await supabase.from('quote_shifts').delete().eq('quote_id', quoteId);
  await supabase.from('quote_subcontractors').delete().eq('quote_id', quoteId);
  
  // Then delete the quote itself
  const { error } = await supabase.from('quotes').delete().eq('id', quoteId);
  
  if (error) {
    throw new Error(`Error deleting quote: ${error.message}`);
  }
};
