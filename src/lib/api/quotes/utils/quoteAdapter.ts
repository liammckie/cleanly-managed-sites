
import { QuoteStatus, Frequency, Day, EmployeeLevel, EmploymentType } from '@/types/common';
import { Quote, QuoteShift, QuoteSubcontractor } from '@/lib/types/quotes';
import { toQuoteStatus, toFrequency, toDay, toEmploymentType, toEmployeeLevel, toContractLengthUnit } from './quoteDbTypeAdapter';

// Convert database quote record to application Quote model
export function adaptQuote(dbQuote: any): Quote {
  // Basic validation
  if (!dbQuote || !dbQuote.id) {
    throw new Error('Invalid quote data');
  }

  return {
    // Basic quote info
    id: dbQuote.id,
    name: dbQuote.name || '',
    title: dbQuote.title || '',
    description: dbQuote.description || '',
    notes: dbQuote.notes || '',
    
    // Client info
    clientName: dbQuote.client_name,
    client_name: dbQuote.client_name,
    siteName: dbQuote.site_name || '',
    site_name: dbQuote.site_name || '',
    clientContact: dbQuote.client_contact || '',
    clientEmail: dbQuote.client_email || '',
    clientPhone: dbQuote.client_phone || '',
    siteAddress: dbQuote.site_address || '',
    
    // Financial calculations
    status: toQuoteStatus(dbQuote.status),
    overheadPercentage: dbQuote.overhead_percentage || 0,
    overhead_percentage: dbQuote.overhead_percentage || 0,
    marginPercentage: dbQuote.margin_percentage || 0,
    margin_percentage: dbQuote.margin_percentage || 0,
    laborCost: dbQuote.labor_cost || 0,
    labor_cost: dbQuote.labor_cost || 0,
    supplies_cost: dbQuote.supplies_cost || 0,
    suppliesCost: dbQuote.supplies_cost || 0,
    equipment_cost: dbQuote.equipment_cost || 0,
    equipmentCost: dbQuote.equipment_cost || 0,
    subcontractorCost: dbQuote.subcontractor_cost || 0,
    subcontractor_cost: dbQuote.subcontractor_cost || 0,
    totalPrice: dbQuote.total_price || 0,
    total_price: dbQuote.total_price || 0,
    overheadCost: dbQuote.overhead_cost || 0,
    overhead_cost: dbQuote.overhead_cost || 0,
    totalCost: dbQuote.total_cost || 0,
    total_cost: dbQuote.total_cost || 0,
    marginAmount: dbQuote.margin_amount || 0,
    margin_amount: dbQuote.margin_amount || 0,
    
    // Dates and numbers
    quoteNumber: dbQuote.quote_number || '',
    quote_number: dbQuote.quote_number || '',
    validUntil: dbQuote.valid_until || '',
    valid_until: dbQuote.valid_until || '',
    createdAt: dbQuote.created_at || '',
    created_at: dbQuote.created_at || '',
    updatedAt: dbQuote.updated_at || '',
    updated_at: dbQuote.updated_at || '',
    
    // Contract details
    startDate: dbQuote.start_date || '',
    start_date: dbQuote.start_date || '',
    endDate: dbQuote.end_date || '',
    end_date: dbQuote.end_date || '',
    expiryDate: dbQuote.expiry_date || '',
    expiry_date: dbQuote.expiry_date || '',
    contractLength: dbQuote.contract_length || 0,
    contract_length: dbQuote.contract_length || 0,
    contractLengthUnit: toContractLengthUnit(dbQuote.contract_length_unit || 'months'),
    contract_length_unit: dbQuote.contract_length_unit || 'months',
    
    // References
    clientId: dbQuote.client_id || '',
    client_id: dbQuote.client_id || '',
    siteId: dbQuote.site_id || '',
    site_id: dbQuote.site_id || '',
    
    // Service details
    frequency: dbQuote.frequency || '',
    scope: dbQuote.scope || '',
    terms: dbQuote.terms || '',
    
    // Empty arrays if not provided
    shifts: [],
    subcontractors: []
  };
}

// Convert database quote records to application Quote models
export function adaptQuotes(dbQuotes: any[]): Quote[] {
  if (!Array.isArray(dbQuotes)) {
    return [];
  }
  
  return dbQuotes.map(adaptQuote);
}

// Prepare Quote data for API submission
export function prepareQuoteForApi(quote: Partial<Quote>): any {
  return {
    name: quote.name,
    client_name: quote.clientName || quote.client_name,
    site_name: quote.siteName || quote.site_name,
    status: quote.status || 'draft',
    overhead_percentage: quote.overheadPercentage || quote.overhead_percentage || 15,
    margin_percentage: quote.marginPercentage || quote.margin_percentage || 20,
    labor_cost: quote.laborCost || quote.labor_cost || 0,
    supplies_cost: quote.suppliesCost || quote.supplies_cost || 0,
    equipment_cost: quote.equipmentCost || quote.equipment_cost || 0,
    subcontractor_cost: quote.subcontractorCost || quote.subcontractor_cost || 0,
    total_price: quote.totalPrice || quote.total_price || 0,
    overhead_cost: quote.overheadCost || quote.overhead_cost || 0,
    total_cost: quote.totalCost || quote.total_cost || 0,
    margin_amount: quote.marginAmount || quote.margin_amount || 0,
    description: quote.description || '',
    notes: quote.notes || '',
    start_date: quote.startDate || quote.start_date || null,
    end_date: quote.endDate || quote.end_date || null,
    expiry_date: quote.expiryDate || quote.expiry_date || null,
    contract_length: quote.contractLength || quote.contract_length || null,
    contract_length_unit: quote.contractLengthUnit || quote.contract_length_unit || 'months',
    client_id: quote.clientId || quote.client_id || null,
    site_id: quote.siteId || quote.site_id || null,
    client_contact: quote.clientContact || '',
    client_email: quote.clientEmail || '',
    client_phone: quote.clientPhone || '',
    site_address: quote.siteAddress || '',
    frequency: quote.frequency || '',
    scope: quote.scope || '',
    terms: quote.terms || ''
  };
}
