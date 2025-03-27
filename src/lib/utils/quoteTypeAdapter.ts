
import { Quote, QuoteShift, QuoteSubcontractor } from '@/lib/types/quotes';

/**
 * Adapts a quote from database format to application format
 */
export function adaptQuote(dbQuote: any): Quote {
  // Convert snake_case to camelCase and ensure all properties exist
  const quote: Quote = {
    id: dbQuote.id,
    name: dbQuote.name,
    client_name: dbQuote.client_name || '',
    site_name: dbQuote.site_name || '',
    status: dbQuote.status || 'draft',
    overhead_percentage: dbQuote.overhead_percentage || 15,
    margin_percentage: dbQuote.margin_percentage || 20,
    total_price: dbQuote.total_price || 0,
    labor_cost: dbQuote.labor_cost || 0,
    subcontractor_cost: dbQuote.subcontractor_cost || 0,
    created_at: dbQuote.created_at || new Date().toISOString(),
    updated_at: dbQuote.updated_at || new Date().toISOString(),
    notes: dbQuote.notes || '',
    
    // Add camelCase aliases for convenience
    clientName: dbQuote.client_name || dbQuote.clientName || '',
    siteName: dbQuote.site_name || dbQuote.siteName || '',
    overheadPercentage: dbQuote.overhead_percentage || dbQuote.overheadPercentage || 15,
    marginPercentage: dbQuote.margin_percentage || dbQuote.marginPercentage || 20,
    totalPrice: dbQuote.total_price || dbQuote.totalPrice || 0,
    laborCost: dbQuote.labor_cost || dbQuote.laborCost || 0,
    subcontractorCost: dbQuote.subcontractor_cost || dbQuote.subcontractorCost || 0,
    createdAt: dbQuote.created_at || dbQuote.createdAt || new Date().toISOString(),
    updatedAt: dbQuote.updated_at || dbQuote.updatedAt || new Date().toISOString(),
  };
  
  // Add optional properties if they exist
  if (dbQuote.title) quote.title = dbQuote.title;
  if (dbQuote.description) quote.description = dbQuote.description;
  if (dbQuote.supplies_cost) quote.supplies_cost = dbQuote.supplies_cost;
  if (dbQuote.equipment_cost) quote.equipment_cost = dbQuote.equipment_cost;
  if (dbQuote.quote_number) quote.quote_number = dbQuote.quote_number;
  if (dbQuote.valid_until) quote.valid_until = dbQuote.valid_until;
  if (dbQuote.client_id) quote.client_id = dbQuote.client_id;
  if (dbQuote.site_id) quote.site_id = dbQuote.site_id;
  if (dbQuote.overhead_cost) quote.overhead_cost = dbQuote.overhead_cost;
  if (dbQuote.total_cost) quote.total_cost = dbQuote.total_cost;
  if (dbQuote.margin_amount) quote.margin_amount = dbQuote.margin_amount;
  if (dbQuote.start_date) quote.start_date = dbQuote.start_date;
  if (dbQuote.end_date) quote.end_date = dbQuote.end_date;
  if (dbQuote.expiry_date) quote.expiry_date = dbQuote.expiry_date;
  if (dbQuote.contract_length) quote.contract_length = dbQuote.contract_length;
  if (dbQuote.contract_length_unit) quote.contract_length_unit = dbQuote.contract_length_unit;
  if (dbQuote.overhead_profile) quote.overhead_profile = dbQuote.overhead_profile;
  if (dbQuote.user_id) quote.user_id = dbQuote.user_id;
  if (dbQuote.created_by) quote.created_by = dbQuote.created_by;
  if (dbQuote.frequency) quote.frequency = dbQuote.frequency;
  if (dbQuote.scope) quote.scope = dbQuote.scope;
  if (dbQuote.terms) quote.terms = dbQuote.terms;
  
  // Add camelCase versions of optional fields
  if (dbQuote.supplies_cost || dbQuote.suppliesCost) quote.suppliesCost = dbQuote.supplies_cost || dbQuote.suppliesCost;
  if (dbQuote.equipment_cost || dbQuote.equipmentCost) quote.equipmentCost = dbQuote.equipment_cost || dbQuote.equipmentCost;
  if (dbQuote.quote_number || dbQuote.quoteNumber) quote.quoteNumber = dbQuote.quote_number || dbQuote.quoteNumber;
  if (dbQuote.valid_until || dbQuote.validUntil) quote.validUntil = dbQuote.valid_until || dbQuote.validUntil;
  if (dbQuote.client_id || dbQuote.clientId) quote.clientId = dbQuote.client_id || dbQuote.clientId;
  if (dbQuote.site_id || dbQuote.siteId) quote.siteId = dbQuote.site_id || dbQuote.siteId;
  if (dbQuote.overhead_cost || dbQuote.overheadCost) quote.overheadCost = dbQuote.overhead_cost || dbQuote.overheadCost;
  if (dbQuote.total_cost || dbQuote.totalCost) quote.totalCost = dbQuote.total_cost || dbQuote.totalCost;
  if (dbQuote.margin_amount || dbQuote.marginAmount) quote.marginAmount = dbQuote.margin_amount || dbQuote.marginAmount;
  if (dbQuote.start_date || dbQuote.startDate) quote.startDate = dbQuote.start_date || dbQuote.startDate;
  if (dbQuote.end_date || dbQuote.endDate) quote.endDate = dbQuote.end_date || dbQuote.endDate;
  if (dbQuote.expiry_date || dbQuote.expiryDate) quote.expiryDate = dbQuote.expiry_date || dbQuote.expiryDate;
  
  // Handle shifts and subcontractors if they exist
  if (dbQuote.shifts && Array.isArray(dbQuote.shifts)) {
    quote.shifts = dbQuote.shifts.map((shift: any) => adaptQuoteShift(shift));
  }
  
  if (dbQuote.subcontractors && Array.isArray(dbQuote.subcontractors)) {
    quote.subcontractors = dbQuote.subcontractors.map((sub: any) => adaptQuoteSubcontractor(sub));
  }
  
  return quote;
}

/**
 * Adapts a list of quotes from database format to application format
 */
export function adaptModelsToQuotes(dbQuotes: any[]): Quote[] {
  return dbQuotes.map(adaptQuote);
}

/**
 * Adapts a quote shift from database format to application format
 */
export function adaptQuoteShift(dbShift: any): QuoteShift {
  return {
    id: dbShift.id,
    quote_id: dbShift.quote_id || dbShift.quoteId || '',
    day: dbShift.day,
    start_time: dbShift.start_time || dbShift.startTime || '',
    end_time: dbShift.end_time || dbShift.endTime || '',
    break_duration: dbShift.break_duration || dbShift.breakDuration || 0,
    number_of_cleaners: dbShift.number_of_cleaners || dbShift.numberOfCleaners || 1,
    employment_type: dbShift.employment_type || dbShift.employmentType || 'casual',
    level: dbShift.level || 1,
    allowances: dbShift.allowances || [],
    estimated_cost: dbShift.estimated_cost || dbShift.estimatedCost || 0,
    location: dbShift.location || '',
    notes: dbShift.notes || '',
  };
}

/**
 * Adapts a quote subcontractor from database format to application format
 */
export function adaptQuoteSubcontractor(dbSub: any): QuoteSubcontractor {
  return {
    id: dbSub.id,
    quote_id: dbSub.quote_id || dbSub.quoteId || '',
    name: dbSub.name || '',
    description: dbSub.description || '',
    cost: dbSub.cost || 0,
    frequency: dbSub.frequency || 'monthly',
    email: dbSub.email || '',
    phone: dbSub.phone || '',
    services: dbSub.services || [],
    service: dbSub.service || '',
    notes: dbSub.notes || '',
  };
}
