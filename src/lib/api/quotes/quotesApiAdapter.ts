import { supabase } from '@/lib/supabase';
import { Quote, QuoteShift, QuoteSubcontractor } from '@/types/models';
import { toQuoteStatus, toDay, toFrequency, toEmploymentType, toEmployeeLevel, toContractLengthUnit } from './utils/quoteDbTypeAdapter';
import { Json } from '@/types';

// Helper function to convert database quote to application Quote type
export function dbToAppQuote(dbQuote: any): Quote {
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    title: dbQuote.title || '',
    description: dbQuote.description || '',
    clientName: dbQuote.client_name,
    client_name: dbQuote.client_name,
    siteName: dbQuote.site_name || '',
    site_name: dbQuote.site_name || '',
    status: toQuoteStatus(dbQuote.status),
    overheadPercentage: dbQuote.overhead_percentage,
    overhead_percentage: dbQuote.overhead_percentage,
    marginPercentage: dbQuote.margin_percentage,
    margin_percentage: dbQuote.margin_percentage,
    laborCost: dbQuote.labor_cost,
    labor_cost: dbQuote.labor_cost,
    supplies_cost: dbQuote.supplies_cost || 0,
    suppliesCost: dbQuote.supplies_cost || 0,
    equipment_cost: dbQuote.equipment_cost || 0,
    equipmentCost: dbQuote.equipment_cost || 0,
    subcontractorCost: dbQuote.subcontractor_cost,
    subcontractor_cost: dbQuote.subcontractor_cost,
    totalPrice: dbQuote.total_price,
    total_price: dbQuote.total_price,
    overheadCost: dbQuote.overhead_cost || 0,
    overhead_cost: dbQuote.overhead_cost || 0,
    totalCost: dbQuote.total_cost || 0,
    total_cost: dbQuote.total_cost || 0,
    marginAmount: dbQuote.margin_amount || 0,
    margin_amount: dbQuote.margin_amount || 0,
    createdAt: dbQuote.created_at,
    created_at: dbQuote.created_at,
    updatedAt: dbQuote.updated_at,
    updated_at: dbQuote.updated_at,
    quoteNumber: dbQuote.quote_number || '',
    quote_number: dbQuote.quote_number || '',
    validUntil: dbQuote.valid_until || '',
    valid_until: dbQuote.valid_until || '',
    clientContact: dbQuote.client_contact || '',
    client_contact: dbQuote.client_contact || '',
    clientEmail: dbQuote.client_email || '',
    client_email: dbQuote.client_email || '',
    clientPhone: dbQuote.client_phone || '',
    client_phone: dbQuote.client_phone || '',
    siteAddress: dbQuote.site_address || '',
    site_address: dbQuote.site_address || '',
    frequency: dbQuote.frequency || '',
    scope: dbQuote.scope || '',
    terms: dbQuote.terms || '',
    startDate: dbQuote.start_date || '',
    start_date: dbQuote.start_date || '',
    endDate: dbQuote.end_date || '',
    end_date: dbQuote.end_date || '',
    expiryDate: dbQuote.expiry_date || '',
    expiry_date: dbQuote.expiry_date || '',
    contractLength: dbQuote.contract_length || 0,
    contract_length: dbQuote.contract_length || 0,
    contractLengthUnit: toContractLengthUnit(dbQuote.contract_length_unit || 'months'),
    contract_length_unit: toContractLengthUnit(dbQuote.contract_length_unit || 'months'),
    clientId: dbQuote.client_id || '',
    client_id: dbQuote.client_id || '',
    siteId: dbQuote.site_id || '',
    site_id: dbQuote.site_id || '',
    notes: dbQuote.notes || '',
    shifts: [],
    subcontractors: [],
  };
}

// Helper function to convert database quote shift to application QuoteShift type
export function dbToAppQuoteShift(dbShift: any): QuoteShift {
  return {
    id: dbShift.id,
    quoteId: dbShift.quote_id,
    day: toDay(dbShift.day),
    startTime: dbShift.start_time,
    endTime: dbShift.end_time,
    breakDuration: dbShift.break_duration,
    numberOfCleaners: dbShift.number_of_cleaners,
    employmentType: toEmploymentType(dbShift.employment_type),
    level: toEmployeeLevel(dbShift.level),
    allowances: Array.isArray(dbShift.allowances) 
      ? dbShift.allowances.map((a: Json) => String(a))
      : [],
    estimatedCost: dbShift.estimated_cost,
    location: dbShift.location,
    notes: dbShift.notes,
  };
}

// Helper function to convert database quote subcontractor to application QuoteSubcontractor type
export function dbToAppQuoteSubcontractor(dbSubcontractor: any): QuoteSubcontractor {
  return {
    id: dbSubcontractor.id,
    quoteId: dbSubcontractor.quote_id,
    name: dbSubcontractor.name,
    description: dbSubcontractor.description || '',
    cost: dbSubcontractor.cost,
    frequency: toFrequency(dbSubcontractor.frequency || 'monthly'),
    email: dbSubcontractor.email || '',
    phone: dbSubcontractor.phone || '',
    notes: dbSubcontractor.notes || '',
    service: dbSubcontractor.service || '',
    services: dbSubcontractor.services || [],
    customServices: dbSubcontractor.custom_services || '',
    monthlyCost: dbSubcontractor.monthly_cost || 0,
    isFlatRate: dbSubcontractor.is_flat_rate || false,
    business_name: dbSubcontractor.business_name || '',
    contact_name: dbSubcontractor.contact_name || '',
  };
}

// Export functions to fetch and adapt quote data
export async function fetchAndAdaptQuotes(): Promise<Quote[]> {
  const { data: quotes, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quotes:', error);
    throw new Error(`Failed to fetch quotes: ${error.message}`);
  }

  return quotes.map(quote => dbToAppQuote(quote));
}

export async function fetchAndAdaptQuoteById(quoteId: string): Promise<Quote> {
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

  // Fetch related shifts
  const { data: shifts, error: shiftsError } = await supabase
    .from('quote_shifts')
    .select('*')
    .eq('quote_id', quoteId);

  if (shiftsError) {
    console.error('Error fetching quote shifts:', shiftsError);
  }

  // Fetch related subcontractors
  const { data: subcontractors, error: subcontractorsError } = await supabase
    .from('quote_subcontractors')
    .select('*')
    .eq('quote_id', quoteId);

  if (subcontractorsError) {
    console.error('Error fetching quote subcontractors:', subcontractorsError);
  }

  // Convert to application types
  const appQuote = dbToAppQuote(quote);
  appQuote.shifts = shifts ? shifts.map(dbToAppQuoteShift) : [];
  appQuote.subcontractors = subcontractors ? subcontractors.map(dbToAppQuoteSubcontractor) : [];

  return appQuote;
}

// You should implement equivalent functions for create, update, and delete operations
// using the same type conversion approach
