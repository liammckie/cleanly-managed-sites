
import { Quote } from '@/types/models';

// Convert a Quote object to the format expected by the API
export function convertQuoteToApiFormat(quote: Partial<Quote>): any {
  return {
    name: quote.name,
    client_name: quote.clientName || quote.client_name,
    site_name: quote.siteName || quote.site_name,
    status: quote.status,
    overhead_percentage: quote.overheadPercentage || quote.overhead_percentage || 15,
    margin_percentage: quote.marginPercentage || quote.margin_percentage || 20,
    labor_cost: quote.laborCost || quote.labor_cost || 0,
    supplies_cost: quote.suppliesCost || quote.supplies_cost || 0,
    equipment_cost: quote.equipmentCost || quote.equipment_cost || 0,
    subcontractor_cost: quote.subcontractorCost || quote.subcontractor_cost || 0,
    notes: quote.notes || '',
    
    // Optional fields
    description: quote.description,
    start_date: quote.startDate || quote.start_date,
    end_date: quote.endDate || quote.end_date,
    expiry_date: quote.expiryDate || quote.expiry_date,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    client_id: quote.clientId || quote.client_id,
    site_id: quote.siteId || quote.site_id,
    
    // More optional fields
    client_contact: quote.clientContact || quote.client_contact,
    client_email: quote.clientEmail || quote.client_email,
    client_phone: quote.clientPhone || quote.client_phone,
    site_address: quote.siteAddress || quote.site_address,
    frequency: quote.frequency,
    scope: quote.scope,
    terms: quote.terms,
  };
}

// Convert API response to Quote object
export function convertApiResponseToQuote(response: any): Quote {
  return {
    id: response.id,
    name: response.name,
    clientName: response.client_name,
    client_name: response.client_name,
    siteName: response.site_name,
    site_name: response.site_name,
    status: response.status,
    overheadPercentage: response.overhead_percentage,
    overhead_percentage: response.overhead_percentage,
    marginPercentage: response.margin_percentage,
    margin_percentage: response.margin_percentage,
    totalPrice: response.total_price,
    total_price: response.total_price,
    laborCost: response.labor_cost,
    labor_cost: response.labor_cost,
    suppliesCost: response.supplies_cost,
    supplies_cost: response.supplies_cost,
    equipmentCost: response.equipment_cost,
    equipment_cost: response.equipment_cost,
    subcontractorCost: response.subcontractor_cost,
    subcontractor_cost: response.subcontractor_cost,
    createdAt: response.created_at,
    created_at: response.created_at,
    updatedAt: response.updated_at,
    updated_at: response.updated_at,
    notes: response.notes || '',
    
    // Optional fields
    description: response.description,
    quoteNumber: response.quote_number,
    quote_number: response.quote_number,
    validUntil: response.valid_until,
    valid_until: response.valid_until,
    clientId: response.client_id,
    client_id: response.client_id,
    siteId: response.site_id,
    site_id: response.site_id,
    
    // More optional fields
    startDate: response.start_date,
    start_date: response.start_date,
    endDate: response.end_date,
    end_date: response.end_date,
    expiryDate: response.expiry_date,
    expiry_date: response.expiry_date,
    contractLength: response.contract_length,
    contractLengthUnit: response.contract_length_unit,
    
    // User info
    createdBy: response.created_by,
    created_by: response.created_by,
    userId: response.user_id,
    user_id: response.user_id,
    
    // Even more optional fields
    clientContact: response.client_contact,
    client_contact: response.client_contact,
    clientEmail: response.client_email,
    client_email: response.client_email,
    clientPhone: response.client_phone,
    client_phone: response.client_phone,
    siteAddress: response.site_address,
    site_address: response.site_address,
    frequency: response.frequency,
    scope: response.scope,
    terms: response.terms,
    
    // Calculated fields
    overheadCost: response.overhead_cost,
    overhead_cost: response.overhead_cost,
    totalCost: response.total_cost,
    total_cost: response.total_cost,
    marginAmount: response.margin_amount,
    margin_amount: response.margin_amount,
    
    // Placeholder for relationships
    shifts: [],
    subcontractors: [],
  } as Quote;
}
