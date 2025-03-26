
import { supabase } from '@/lib/supabase';
import { Quote } from '@/types/models';
import { fetchQuoteShiftsByQuoteId } from './quoteShiftsApi';
import { fetchQuoteSubcontractorsByQuoteId } from './quoteSubcontractorsApi';
import { calculateTotalCosts } from '@/utils/quoteCalculations';

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

  // Map the database records to the Quote interface
  return quotes.map(quote => {
    return {
      id: quote.id,
      name: quote.name,
      description: quote.description || '',
      clientName: quote.client_name,
      client_name: quote.client_name,
      siteName: quote.site_name,
      site_name: quote.site_name,
      status: quote.status,
      overheadPercentage: quote.overhead_percentage,
      overhead_percentage: quote.overhead_percentage,
      marginPercentage: quote.margin_percentage,
      margin_percentage: quote.margin_percentage,
      laborCost: quote.labor_cost,
      labor_cost: quote.labor_cost,
      supplies_cost: quote.supplies_cost || 0,
      suppliesCost: quote.supplies_cost || 0,
      equipment_cost: quote.equipment_cost || 0,
      equipmentCost: quote.equipment_cost || 0,
      subcontractorCost: quote.subcontractor_cost,
      subcontractor_cost: quote.subcontractor_cost,
      totalPrice: quote.total_price,
      total_price: quote.total_price,
      overheadCost: quote.overhead_cost || 0,
      overhead_cost: quote.overhead_cost || 0,
      totalCost: quote.total_cost || 0,
      total_cost: quote.total_cost || 0,
      marginAmount: quote.margin_amount || 0,
      margin_amount: quote.margin_amount || 0,
      quoteNumber: quote.quote_number || '',
      quote_number: quote.quote_number || '',
      validUntil: quote.valid_until || '',
      valid_until: quote.valid_until || '',
      createdAt: quote.created_at,
      created_at: quote.created_at,
      updatedAt: quote.updated_at,
      updated_at: quote.updated_at,
      clientContact: quote.client_contact || '',
      client_contact: quote.client_contact || '',
      clientEmail: quote.client_email || '',
      client_email: quote.client_email || '',
      clientPhone: quote.client_phone || '',
      client_phone: quote.client_phone || '',
      siteAddress: quote.site_address || '',
      site_address: quote.site_address || '',
      frequency: quote.frequency || '',
      scope: quote.scope || '',
      terms: quote.terms || '',
      startDate: quote.start_date || '',
      start_date: quote.start_date || '',
      endDate: quote.end_date || '',
      end_date: quote.end_date || '',
      expiryDate: quote.expiry_date || '',
      expiry_date: quote.expiry_date || '',
      contractLength: quote.contract_length || 0,
      contract_length: quote.contract_length || 0,
      contractLengthUnit: quote.contract_length_unit || 'months',
      contract_length_unit: quote.contract_length_unit || 'months',
      clientId: quote.client_id || '',
      client_id: quote.client_id || '',
      siteId: quote.site_id || '',
      site_id: quote.site_id || '',
      notes: quote.notes || '',
    };
  });
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

  // Map database record to Quote interface
  const mappedQuote: Quote = {
    id: quote.id,
    name: quote.name,
    description: quote.description || '',
    clientName: quote.client_name,
    client_name: quote.client_name,
    siteName: quote.site_name,
    site_name: quote.site_name,
    status: quote.status,
    overheadPercentage: quote.overhead_percentage,
    overhead_percentage: quote.overhead_percentage,
    marginPercentage: quote.margin_percentage,
    margin_percentage: quote.margin_percentage,
    laborCost: quote.labor_cost,
    labor_cost: quote.labor_cost,
    supplies_cost: quote.supplies_cost || 0,
    suppliesCost: quote.supplies_cost || 0,
    equipment_cost: quote.equipment_cost || 0,
    equipmentCost: quote.equipment_cost || 0,
    subcontractorCost: quote.subcontractor_cost,
    subcontractor_cost: quote.subcontractor_cost,
    totalPrice: quote.total_price,
    total_price: quote.total_price,
    overheadCost: quote.overhead_cost || 0,
    overhead_cost: quote.overhead_cost || 0,
    totalCost: quote.total_cost || 0,
    total_cost: quote.total_cost || 0,
    marginAmount: quote.margin_amount || 0,
    margin_amount: quote.margin_amount || 0,
    createdAt: quote.created_at,
    created_at: quote.created_at,
    updatedAt: quote.updated_at,
    updated_at: quote.updated_at,
    quoteNumber: quote.quote_number || '',
    quote_number: quote.quote_number || '',
    validUntil: quote.valid_until || '',
    valid_until: quote.valid_until || '',
    clientContact: quote.client_contact || '',
    client_contact: quote.client_contact || '',
    clientEmail: quote.client_email || '',
    client_email: quote.client_email || '',
    clientPhone: quote.client_phone || '',
    client_phone: quote.client_phone || '',
    siteAddress: quote.site_address || '',
    site_address: quote.site_address || '',
    frequency: quote.frequency || '',
    scope: quote.scope || '',
    terms: quote.terms || '',
    startDate: quote.start_date || '',
    start_date: quote.start_date || '',
    endDate: quote.end_date || '',
    end_date: quote.end_date || '',
    expiryDate: quote.expiry_date || '',
    expiry_date: quote.expiry_date || '',
    contractLength: quote.contract_length || 0,
    contract_length: quote.contract_length || 0,
    contractLengthUnit: quote.contract_length_unit || 'months',
    contract_length_unit: quote.contract_length_unit || 'months',
    clientId: quote.client_id || '',
    client_id: quote.client_id || '',
    siteId: quote.site_id || '',
    site_id: quote.site_id || '',
    notes: quote.notes || '',
    // Add the relationships
    shifts,
    subcontractors
  };

  // Convert any subcontractor fields as needed
  if (subcontractors?.length > 0) {
    mappedQuote.subcontractors = subcontractors.map(sub => ({
      ...sub,
      id: sub.id,
      quoteId: sub.quoteId,
      name: sub.name,
      description: sub.description || '',
      cost: sub.cost,
      frequency: sub.frequency,
      email: sub.email,
      phone: sub.phone,
      notes: sub.notes,
      service: sub.service,
      customServices: sub.custom_services,
      monthlyCost: sub.monthly_cost,
      isFlatRate: sub.is_flat_rate
    }));
  }

  return mappedQuote;
};

// Create a new quote
export const createQuoteMutation = async (quoteData: Partial<Quote>): Promise<Quote> => {
  // Prepare data for insertion
  const dbQuoteData = {
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
    description: quoteData.description || '',
    notes: quoteData.notes || '',
    start_date: quoteData.startDate || quoteData.start_date || null,
    end_date: quoteData.endDate || quoteData.end_date || null,
    expiry_date: quoteData.expiryDate || quoteData.expiry_date || null,
    contract_length: quoteData.contractLength || quoteData.contract_length || null,
    contract_length_unit: quoteData.contractLengthUnit || quoteData.contract_length_unit || 'months',
    client_id: quoteData.clientId || quoteData.client_id || null,
    site_id: quoteData.siteId || quoteData.site_id || null,
    client_contact: quoteData.clientContact || quoteData.client_contact || '',
    client_email: quoteData.clientEmail || quoteData.client_email || '',
    client_phone: quoteData.clientPhone || quoteData.client_phone || '',
    site_address: quoteData.siteAddress || quoteData.site_address || '',
    frequency: quoteData.frequency || '',
    scope: quoteData.scope || '',
    terms: quoteData.terms || ''
  };

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

  // Return the created quote with proper field mapping
  return {
    id: createdQuote.id,
    name: createdQuote.name,
    clientName: createdQuote.client_name,
    client_name: createdQuote.client_name,
    siteName: createdQuote.site_name,
    site_name: createdQuote.site_name,
    status: createdQuote.status,
    overheadPercentage: createdQuote.overhead_percentage,
    overhead_percentage: createdQuote.overhead_percentage,
    marginPercentage: createdQuote.margin_percentage,
    margin_percentage: createdQuote.margin_percentage,
    laborCost: createdQuote.labor_cost,
    labor_cost: createdQuote.labor_cost,
    suppliesCost: createdQuote.supplies_cost || 0,
    supplies_cost: createdQuote.supplies_cost || 0,
    equipmentCost: createdQuote.equipment_cost || 0,
    equipment_cost: createdQuote.equipment_cost || 0,
    subcontractorCost: createdQuote.subcontractor_cost,
    subcontractor_cost: createdQuote.subcontractor_cost,
    overheadCost: createdQuote.overhead_cost || 0, 
    overhead_cost: createdQuote.overhead_cost || 0,
    totalCost: createdQuote.total_cost || 0,
    total_cost: createdQuote.total_cost || 0,
    marginAmount: createdQuote.margin_amount || 0,
    margin_amount: createdQuote.margin_amount || 0,
    totalPrice: createdQuote.total_price,
    total_price: createdQuote.total_price,
    createdAt: createdQuote.created_at,
    created_at: createdQuote.created_at,
    updatedAt: createdQuote.updated_at,
    updated_at: createdQuote.updated_at,
    startDate: createdQuote.start_date || '',
    start_date: createdQuote.start_date || '',
    endDate: createdQuote.end_date || '',
    end_date: createdQuote.end_date || '',
    expiryDate: createdQuote.expiry_date || '',
    expiry_date: createdQuote.expiry_date || '',
    contractLength: createdQuote.contract_length || 0,
    contract_length: createdQuote.contract_length || 0,
    contractLengthUnit: createdQuote.contract_length_unit || 'months',
    contract_length_unit: createdQuote.contract_length_unit || 'months',
    clientId: createdQuote.client_id || '',
    client_id: createdQuote.client_id || '',
    siteId: createdQuote.site_id || '',
    site_id: createdQuote.site_id || '',
    notes: createdQuote.notes || '',
    description: createdQuote.description || '',
    clientContact: createdQuote.client_contact || '',
    client_contact: createdQuote.client_contact || '',
    clientEmail: createdQuote.client_email || '',
    client_email: createdQuote.client_email || '',
    clientPhone: createdQuote.client_phone || '',
    client_phone: createdQuote.client_phone || '',
    siteAddress: createdQuote.site_address || '',
    site_address: createdQuote.site_address || '',
    frequency: createdQuote.frequency || '',
    scope: createdQuote.scope || '',
    terms: createdQuote.terms || ''
  };
};

// Update an existing quote
export const updateQuoteMutation = async (quoteData: Quote): Promise<Quote> => {
  // Prepare data for update
  const dbQuoteData = {
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
    total_price: quoteData.totalPrice || quoteData.total_price || 0,
    overhead_cost: quoteData.overheadCost || quoteData.overhead_cost || 0,
    total_cost: quoteData.totalCost || quoteData.total_cost || 0,
    margin_amount: quoteData.marginAmount || quoteData.margin_amount || 0,
    description: quoteData.description || '',
    notes: quoteData.notes || '',
    start_date: quoteData.startDate || quoteData.start_date || null,
    end_date: quoteData.endDate || quoteData.end_date || null,
    expiry_date: quoteData.expiryDate || quoteData.expiry_date || null,
    contract_length: quoteData.contractLength || quoteData.contract_length || null,
    contract_length_unit: quoteData.contractLengthUnit || quoteData.contract_length_unit || 'months',
    client_id: quoteData.clientId || quoteData.client_id || null,
    site_id: quoteData.siteId || quoteData.site_id || null,
    client_contact: quoteData.clientContact || quoteData.client_contact || '',
    client_email: quoteData.clientEmail || quoteData.client_email || '',
    client_phone: quoteData.clientPhone || quoteData.client_phone || '',
    site_address: quoteData.siteAddress || quoteData.site_address || '',
    frequency: quoteData.frequency || '',
    scope: quoteData.scope || '',
    terms: quoteData.terms || ''
  };

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

  // Return the updated quote with proper field mapping
  return {
    id: updatedQuote.id,
    name: updatedQuote.name,
    clientName: updatedQuote.client_name,
    client_name: updatedQuote.client_name,
    siteName: updatedQuote.site_name,
    site_name: updatedQuote.site_name,
    status: updatedQuote.status,
    overheadPercentage: updatedQuote.overhead_percentage,
    overhead_percentage: updatedQuote.overhead_percentage,
    marginPercentage: updatedQuote.margin_percentage,
    margin_percentage: updatedQuote.margin_percentage,
    laborCost: updatedQuote.labor_cost,
    labor_cost: updatedQuote.labor_cost,
    suppliesCost: updatedQuote.supplies_cost || 0,
    supplies_cost: updatedQuote.supplies_cost || 0,
    equipmentCost: updatedQuote.equipment_cost || 0, 
    equipment_cost: updatedQuote.equipment_cost || 0,
    subcontractorCost: updatedQuote.subcontractor_cost,
    subcontractor_cost: updatedQuote.subcontractor_cost,
    overheadCost: updatedQuote.overhead_cost || 0,
    overhead_cost: updatedQuote.overhead_cost || 0,
    totalCost: updatedQuote.total_cost || 0,
    total_cost: updatedQuote.total_cost || 0,
    marginAmount: updatedQuote.margin_amount || 0,
    margin_amount: updatedQuote.margin_amount || 0,
    totalPrice: updatedQuote.total_price,
    total_price: updatedQuote.total_price,
    createdAt: updatedQuote.created_at,
    created_at: updatedQuote.created_at,
    updatedAt: updatedQuote.updated_at,
    updated_at: updatedQuote.updated_at,
    startDate: updatedQuote.start_date || '',
    start_date: updatedQuote.start_date || '',
    endDate: updatedQuote.end_date || '',
    end_date: updatedQuote.end_date || '',
    expiryDate: updatedQuote.expiry_date || '',
    expiry_date: updatedQuote.expiry_date || '',
    contractLength: updatedQuote.contract_length || 0,
    contract_length: updatedQuote.contract_length || 0,
    contractLengthUnit: updatedQuote.contract_length_unit || 'months',
    contract_length_unit: updatedQuote.contract_length_unit || 'months',
    clientId: updatedQuote.client_id || '',
    client_id: updatedQuote.client_id || '',
    siteId: updatedQuote.site_id || '',
    site_id: updatedQuote.site_id || '',
    notes: updatedQuote.notes || '',
    description: updatedQuote.description || '',
    clientContact: updatedQuote.client_contact || '',
    client_contact: updatedQuote.client_contact || '',
    clientEmail: updatedQuote.client_email || '',
    client_email: updatedQuote.client_email || '',
    clientPhone: updatedQuote.client_phone || '',
    client_phone: updatedQuote.client_phone || '',
    siteAddress: updatedQuote.site_address || '',
    site_address: updatedQuote.site_address || '',
    frequency: updatedQuote.frequency || '',
    scope: updatedQuote.scope || '',
    terms: updatedQuote.terms || ''
  };
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
