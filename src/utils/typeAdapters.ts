
import { Day } from '@/types/common';
import { Quote, QuoteShift, QuoteSubcontractor } from '@/types/models';

/**
 * Converts any day string to the Day type
 * This helps bridge the gap between different parts of the application
 * that might use different day formats
 */
export function adaptDay(day: string): Day {
  return day as Day;
}

/**
 * Adapts a database quote to the application Quote type
 */
export function adaptQuote(dbQuote: any): Quote {
  // Convert snake_case to camelCase and ensure all properties exist
  const quote: Quote = {
    id: dbQuote.id,
    name: dbQuote.name || '',
    clientName: dbQuote.client_name || dbQuote.clientName || '',
    siteName: dbQuote.site_name || dbQuote.siteName || '',
    status: dbQuote.status || 'draft',
    overheadPercentage: dbQuote.overhead_percentage || dbQuote.overheadPercentage || 15,
    marginPercentage: dbQuote.margin_percentage || dbQuote.marginPercentage || 20,
    totalPrice: dbQuote.total_price || dbQuote.totalPrice || 0,
    laborCost: dbQuote.labor_cost || dbQuote.laborCost || 0,
    subcontractorCost: dbQuote.subcontractor_cost || dbQuote.subcontractorCost || 0,
    createdAt: dbQuote.created_at || dbQuote.createdAt || new Date().toISOString(),
    updatedAt: dbQuote.updated_at || dbQuote.updatedAt || new Date().toISOString(),
    notes: dbQuote.notes || '',
    
    // Add snake_case versions for backend compatibility
    client_name: dbQuote.client_name || dbQuote.clientName || '',
    site_name: dbQuote.site_name || dbQuote.siteName || '',
    overhead_percentage: dbQuote.overhead_percentage || dbQuote.overheadPercentage || 15,
    margin_percentage: dbQuote.margin_percentage || dbQuote.marginPercentage || 20,
    total_price: dbQuote.total_price || dbQuote.totalPrice || 0,
    labor_cost: dbQuote.labor_cost || dbQuote.laborCost || 0,
    subcontractor_cost: dbQuote.subcontractor_cost || dbQuote.subcontractorCost || 0,
    created_at: dbQuote.created_at || dbQuote.createdAt || new Date().toISOString(),
    updated_at: dbQuote.updated_at || dbQuote.updatedAt || new Date().toISOString(),
  };
  
  // Add optional properties if they exist
  if (dbQuote.title) quote.title = dbQuote.title;
  if (dbQuote.description) quote.description = dbQuote.description;
  if (dbQuote.supplies_cost) {
    quote.supplies_cost = dbQuote.supplies_cost;
    quote.suppliesCost = dbQuote.supplies_cost;
  }
  if (dbQuote.equipment_cost) {
    quote.equipment_cost = dbQuote.equipment_cost;
    quote.equipmentCost = dbQuote.equipment_cost;
  }
  if (dbQuote.quote_number) {
    quote.quote_number = dbQuote.quote_number;
    quote.quoteNumber = dbQuote.quote_number;
  }
  if (dbQuote.valid_until) {
    quote.valid_until = dbQuote.valid_until;
    quote.validUntil = dbQuote.valid_until;
  }
  if (dbQuote.client_id) {
    quote.client_id = dbQuote.client_id;
    quote.clientId = dbQuote.client_id;
  }
  if (dbQuote.site_id) {
    quote.site_id = dbQuote.site_id;
    quote.siteId = dbQuote.site_id;
  }
  if (dbQuote.overhead_cost) {
    quote.overhead_cost = dbQuote.overhead_cost;
    quote.overheadCost = dbQuote.overhead_cost;
  }
  if (dbQuote.total_cost) {
    quote.total_cost = dbQuote.total_cost;
    quote.totalCost = dbQuote.total_cost;
  }
  if (dbQuote.margin_amount) {
    quote.margin_amount = dbQuote.margin_amount;
    quote.marginAmount = dbQuote.margin_amount;
  }
  if (dbQuote.start_date) {
    quote.start_date = dbQuote.start_date;
    quote.startDate = dbQuote.start_date;
  }
  if (dbQuote.end_date) {
    quote.end_date = dbQuote.end_date;
    quote.endDate = dbQuote.end_date;
  }
  if (dbQuote.expiry_date) {
    quote.expiry_date = dbQuote.expiry_date;
    quote.expiryDate = dbQuote.expiry_date;
  }
  
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
 * Convert DbOverheadProfile to an OverheadProfile
 */
export function dbToOverheadProfile(dbProfile: any) {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    description: dbProfile.description,
    laborPercentage: dbProfile.labor_percentage
  };
}

/**
 * Adapts a quote shift from database format to application format
 */
export function adaptQuoteShift(dbShift: any): QuoteShift {
  return {
    id: dbShift.id,
    quote_id: dbShift.quote_id || dbShift.quoteId || '',
    day: adaptDay(dbShift.day),
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
    
    // Add camelCase aliases for frontend compatibility
    quoteId: dbShift.quote_id || dbShift.quoteId || '',
    startTime: dbShift.start_time || dbShift.startTime || '',
    endTime: dbShift.end_time || dbShift.endTime || '',
    breakDuration: dbShift.break_duration || dbShift.breakDuration || 0,
    numberOfCleaners: dbShift.number_of_cleaners || dbShift.numberOfCleaners || 1,
    employmentType: dbShift.employment_type || dbShift.employmentType || 'casual',
    estimatedCost: dbShift.estimated_cost || dbShift.estimatedCost || 0
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
    
    // Add camelCase alias for frontend compatibility
    quoteId: dbSub.quote_id || dbSub.quoteId || '',
  };
}

/**
 * Adapts BillingDetails to ensure all required fields are present
 */
export function adaptBillingDetails(details: any = {}) {
  return {
    billingAddress: details.billingAddress || {},
    useClientInfo: details.useClientInfo || false,
    billingMethod: details.billingMethod || 'invoice',
    paymentTerms: details.paymentTerms || '30days',
    billingEmail: details.billingEmail || '',
    billingLines: details.billingLines || [],
    contacts: details.contacts || [],
    // Additional fields that might be needed
    billingCity: details.billingCity || '',
    billingState: details.billingState || '',
    billingPostcode: details.billingPostcode || '',
    notes: details.notes || ''
  };
}

/**
 * Creates a complete BillingAddress object from partial data
 */
export function createBillingAddress(partialAddress: any) {
  return {
    line1: partialAddress.line1 || '',
    line2: partialAddress.line2 || '',
    city: partialAddress.city || '',
    state: partialAddress.state || '',
    postcode: partialAddress.postcode || '',
    country: partialAddress.country || ''
  };
}

/**
 * Adapt contract data to the expected format
 */
export function adaptContract(contractData: any) {
  return {
    id: contractData.id || '',
    name: contractData.name || '',
    client_id: contractData.client_id || '',
    site_id: contractData.site_id || '',
    start_date: contractData.start_date || '',
    end_date: contractData.end_date || '',
    value: contractData.value || 0,
    status: contractData.status || 'active',
    created_at: contractData.created_at || new Date().toISOString(),
    updated_at: contractData.updated_at || new Date().toISOString(),
    // Add any other fields needed
  };
}

/**
 * Adapt contracts array
 */
export function adaptContracts(contractsData: any[]) {
  return contractsData.map(adaptContract);
}
