
import { Quote } from '@/types/models';

/**
 * Adapts database quote data to the Quote type used in the application
 */
export function adaptDbQuoteToAppQuote(dbQuote: any): Partial<Quote> {
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    description: dbQuote.description || '',
    clientName: dbQuote.client_name,
    siteName: dbQuote.site_name,
    status: dbQuote.status as any,
    
    // Financial data
    laborCost: dbQuote.labor_cost || 0,
    supplies_cost: dbQuote.supplies_cost || 0,
    equipment_cost: dbQuote.equipment_cost || 0,
    subcontractorCost: dbQuote.subcontractor_cost || 0,
    overheadCost: dbQuote.overhead_cost || 0,
    overheadPercentage: dbQuote.overhead_percentage || 15,
    marginAmount: dbQuote.margin_amount || 0,
    marginPercentage: dbQuote.margin_percentage || 20,
    totalCost: dbQuote.total_cost || 0,
    totalPrice: dbQuote.total_price || 0,
    
    // Dates
    startDate: dbQuote.start_date || '',
    endDate: dbQuote.end_date || '',
    expiryDate: dbQuote.expiry_date || '',
    createdAt: dbQuote.created_at || '',
    updatedAt: dbQuote.updated_at || '',
    
    // Contract details
    contractLength: dbQuote.contract_length || 0,
    contractLengthUnit: dbQuote.contract_length_unit as any || 'months',
    
    // Client and site details
    clientContact: dbQuote.client_contact || '',
    clientEmail: dbQuote.client_email || '',
    clientPhone: dbQuote.client_phone || '',
    siteAddress: dbQuote.site_address || '',
    frequency: dbQuote.frequency || '',
    scope: dbQuote.scope || '',
    terms: dbQuote.terms || '',
    
    // Reference IDs
    clientId: dbQuote.client_id || '',
    siteId: dbQuote.site_id || '',
    createdBy: dbQuote.created_by || '',
    userId: dbQuote.user_id || '',
    
    notes: dbQuote.notes || ''
  };
}

/**
 * Adapts application Quote type to database format
 */
export function adaptAppQuoteToDb(quote: Partial<Quote>): any {
  return {
    id: quote.id,
    name: quote.name,
    description: quote.description,
    client_name: quote.clientName,
    site_name: quote.siteName,
    status: quote.status,
    
    // Financial data
    labor_cost: quote.laborCost || 0,
    supplies_cost: quote.supplies_cost || 0,
    equipment_cost: quote.equipment_cost || 0, 
    subcontractor_cost: quote.subcontractorCost || 0,
    overhead_cost: quote.overheadCost || 0,
    overhead_percentage: quote.overheadPercentage || 15,
    margin_amount: quote.marginAmount || 0,
    margin_percentage: quote.marginPercentage || 20,
    total_cost: quote.totalCost || 0,
    total_price: quote.totalPrice || 0,
    
    // Dates
    start_date: quote.startDate || null,
    end_date: quote.endDate || null,
    expiry_date: quote.expiryDate || null,
    
    // Contract details
    contract_length: quote.contractLength || 0,
    contract_length_unit: quote.contractLengthUnit || 'months',
    
    // Client and site details
    client_contact: quote.clientContact || '',
    client_email: quote.clientEmail || '',
    client_phone: quote.clientPhone || '',
    site_address: quote.siteAddress || '',
    frequency: quote.frequency || '',
    scope: quote.scope || '',
    terms: quote.terms || '',
    
    // Reference IDs
    client_id: quote.clientId || null,
    site_id: quote.siteId || null,
    created_by: quote.createdBy || null,
    user_id: quote.userId || null,
    
    notes: quote.notes || ''
  };
}
