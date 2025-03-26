
import { Quote } from '@/types/models';

// Function to adapt database quote records to the Quote interface
export function adaptQuote(dbQuote: any): Quote {
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    description: dbQuote.description,
    clientName: dbQuote.client_name,
    client_name: dbQuote.client_name,
    siteName: dbQuote.site_name,
    site_name: dbQuote.site_name,
    status: dbQuote.status,
    overheadPercentage: dbQuote.overhead_percentage,
    overhead_percentage: dbQuote.overhead_percentage,
    marginPercentage: dbQuote.margin_percentage,
    margin_percentage: dbQuote.margin_percentage,
    totalPrice: dbQuote.total_price,
    total_price: dbQuote.total_price,
    laborCost: dbQuote.labor_cost,
    labor_cost: dbQuote.labor_cost,
    suppliesCost: dbQuote.supplies_cost,
    supplies_cost: dbQuote.supplies_cost,
    equipmentCost: dbQuote.equipment_cost,
    equipment_cost: dbQuote.equipment_cost,
    subcontractorCost: dbQuote.subcontractor_cost,
    subcontractor_cost: dbQuote.subcontractor_cost,
    createdAt: dbQuote.created_at,
    created_at: dbQuote.created_at,
    updatedAt: dbQuote.updated_at,
    updated_at: dbQuote.updated_at,
    quoteNumber: dbQuote.quote_number,
    quote_number: dbQuote.quote_number,
    validUntil: dbQuote.valid_until,
    valid_until: dbQuote.valid_until,
    clientId: dbQuote.client_id,
    client_id: dbQuote.client_id,
    siteId: dbQuote.site_id,
    site_id: dbQuote.site_id,
    
    // Optional fields
    clientContact: dbQuote.client_contact,
    client_contact: dbQuote.client_contact,
    clientEmail: dbQuote.client_email,
    client_email: dbQuote.client_email,
    clientPhone: dbQuote.client_phone,
    client_phone: dbQuote.client_phone,
    siteAddress: dbQuote.site_address,
    site_address: dbQuote.site_address,
    frequency: dbQuote.frequency,
    scope: dbQuote.scope,
    terms: dbQuote.terms,
    notes: dbQuote.notes || '',
    
    // Additional calculated fields
    overheadCost: dbQuote.overhead_cost,
    overhead_cost: dbQuote.overhead_cost,
    totalCost: dbQuote.total_cost,
    total_cost: dbQuote.total_cost,
    marginAmount: dbQuote.margin_amount,
    margin_amount: dbQuote.margin_amount,
    
    // Contract related fields
    startDate: dbQuote.start_date,
    start_date: dbQuote.start_date,
    endDate: dbQuote.end_date,
    end_date: dbQuote.end_date,
    expiryDate: dbQuote.expiry_date,
    expiry_date: dbQuote.expiry_date,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit,
    
    // User related
    createdBy: dbQuote.created_by,
    created_by: dbQuote.created_by,
    userId: dbQuote.user_id,
    user_id: dbQuote.user_id,
  };
}

// Function to adapt multiple database quote records
export function adaptQuotes(dbQuotes: any[]): Quote[] {
  return dbQuotes.map(adaptQuote);
}

// Function to prepare a Quote object for the API
export function prepareQuoteForApi(quote: Partial<Quote>): any {
  const apiQuote: any = {
    name: quote.name,
    status: quote.status,
    
    // Use underscored keys for API
    client_name: quote.clientName || quote.client_name,
    site_name: quote.siteName || quote.site_name,
    overhead_percentage: quote.overheadPercentage || quote.overhead_percentage,
    margin_percentage: quote.marginPercentage || quote.margin_percentage,
    total_price: quote.totalPrice || quote.total_price,
    labor_cost: quote.laborCost || quote.labor_cost,
    supplies_cost: quote.suppliesCost || quote.supplies_cost,
    equipment_cost: quote.equipmentCost || quote.equipment_cost,
    subcontractor_cost: quote.subcontractorCost || quote.subcontractor_cost,
    
    // Optional fields
    overhead_cost: quote.overheadCost || quote.overhead_cost,
    total_cost: quote.totalCost || quote.total_cost,
    margin_amount: quote.marginAmount || quote.margin_amount,
    
    // Contract fields
    start_date: quote.startDate || quote.start_date,
    end_date: quote.endDate || quote.end_date,
    expiry_date: quote.expiryDate || quote.expiry_date,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    
    // Additional info
    client_contact: quote.clientContact || quote.client_contact,
    client_email: quote.clientEmail || quote.client_email,
    client_phone: quote.clientPhone || quote.client_phone,
    site_address: quote.siteAddress || quote.site_address,
    frequency: quote.frequency,
    scope: quote.scope,
    terms: quote.terms,
    notes: quote.notes,
    
    // IDs
    client_id: quote.clientId || quote.client_id,
    site_id: quote.siteId || quote.site_id,
    
    // Timestamps and identifiers
    created_by: quote.createdBy || quote.created_by,
    user_id: quote.userId || quote.user_id,
  };
  
  // Only include the ID if it exists (for updates)
  if (quote.id) {
    apiQuote.id = quote.id;
  }
  
  return apiQuote;
}
