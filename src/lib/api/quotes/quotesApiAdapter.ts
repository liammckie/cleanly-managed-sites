
import { Quote } from '@/types/models';

export function adaptDbToQuote(dbQuote: any): Partial<Quote> {
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
