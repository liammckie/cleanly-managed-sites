import { Quote, QuoteShift, QuoteSubcontractor } from '@/lib/types/quotes';
import { adaptQuoteData } from './adapters';

// Adapt models to quotes function - converts DB models to Quote objects
export function adaptModelsToQuotes(data: any[]): Quote[] {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => {
    return {
      id: item.id || '',
      name: item.name || '',
      title: item.title || '',
      client_name: item.client_name || '',
      clientName: item.client_name || '',
      site_name: item.site_name || '',
      siteName: item.site_name || '',
      status: item.status || 'draft',
      overhead_percentage: item.overhead_percentage || 0,
      overheadPercentage: item.overhead_percentage || 0,
      margin_percentage: item.margin_percentage || 0,
      marginPercentage: item.margin_percentage || 0,
      total_price: item.total_price || 0,
      totalPrice: item.total_price || 0,
      labor_cost: item.labor_cost || 0,
      laborCost: item.labor_cost || 0,
      supplies_cost: item.supplies_cost || 0,
      suppliesCost: item.supplies_cost || 0,
      equipment_cost: item.equipment_cost || 0,
      equipmentCost: item.equipment_cost || 0,
      subcontractor_cost: item.subcontractor_cost || 0,
      subcontractorCost: item.subcontractor_cost || 0,
      created_at: item.created_at || '',
      createdAt: item.created_at || '',
      updated_at: item.updated_at || '',
      updatedAt: item.updated_at || '',
      quote_number: item.quote_number || '',
      quoteNumber: item.quote_number || '',
      valid_until: item.valid_until || '',
      validUntil: item.valid_until || '',
      client_id: item.client_id || '',
      clientId: item.client_id || '',
      site_id: item.site_id || '',
      siteId: item.site_id || '',
      notes: item.notes || '',
      description: item.description || '',
      // Any other properties needed
    };
  });
}

// Adapt a single quote object for API use
export function adaptQuote(quote: Quote): any {
  return {
    id: quote.id,
    name: quote.name,
    title: quote.title,
    client_name: quote.client_name || quote.clientName,
    site_name: quote.site_name || quote.siteName,
    status: quote.status,
    overhead_percentage: quote.overhead_percentage || quote.overheadPercentage,
    margin_percentage: quote.margin_percentage || quote.marginPercentage,
    total_price: quote.total_price || quote.totalPrice,
    labor_cost: quote.labor_cost || quote.laborCost,
    supplies_cost: quote.supplies_cost || quote.suppliesCost,
    equipment_cost: quote.equipment_cost || quote.equipmentCost,
    subcontractor_cost: quote.subcontractor_cost || quote.subcontractorCost,
    notes: quote.notes,
    description: quote.description,
    client_id: quote.client_id || quote.clientId,
    site_id: quote.site_id || quote.siteId,
    valid_until: quote.valid_until || quote.validUntil,
    quote_number: quote.quote_number || quote.quoteNumber
  };
}

// Convert API data to Quote objects
export function adaptQuoteData(data: any): Quote {
  if (!data) return {} as Quote;
  
  return {
    id: data.id || '',
    name: data.name || '',
    title: data.title || '',
    client_name: data.client_name || '',
    clientName: data.client_name || '',
    site_name: data.site_name || '',
    siteName: data.site_name || '',
    status: data.status || 'draft',
    overhead_percentage: data.overhead_percentage || 0,
    overheadPercentage: data.overhead_percentage || 0,
    margin_percentage: data.margin_percentage || 0,
    marginPercentage: data.margin_percentage || 0,
    total_price: data.total_price || 0,
    totalPrice: data.total_price || 0,
    labor_cost: data.labor_cost || 0,
    laborCost: data.labor_cost || 0,
    supplies_cost: data.supplies_cost || 0,
    suppliesCost: data.supplies_cost || 0,
    equipment_cost: data.equipment_cost || 0,
    equipmentCost: data.equipment_cost || 0,
    subcontractor_cost: data.subcontractor_cost || 0,
    subcontractorCost: data.subcontractor_cost || 0,
    created_at: data.created_at || '',
    createdAt: data.created_at || '',
    updated_at: data.updated_at || '',
    updatedAt: data.updated_at || '',
    quote_number: data.quote_number || '',
    quoteNumber: data.quote_number || '',
    valid_until: data.valid_until || '',
    validUntil: data.valid_until || '',
    client_id: data.client_id || '',
    clientId: data.client_id || '',
    site_id: data.site_id || '',
    siteId: data.site_id || '',
    notes: data.notes || '',
    description: data.description || '',
    clientContact: data.client_contact || '',
    clientEmail: data.client_email || '',
    clientPhone: data.client_phone || '',
    siteAddress: data.site_address || '',
    frequency: data.frequency || '',
    scope: data.scope || '',
    terms: data.terms || '',
    overhead_cost: data.overhead_cost || 0,
    overheadCost: data.overhead_cost || 0,
    total_cost: data.total_cost || 0,
    totalCost: data.total_cost || 0,
    margin_amount: data.margin_amount || 0,
    marginAmount: data.margin_amount || 0,
    startDate: data.start_date || '',
    start_date: data.start_date || '',
    endDate: data.end_date || '',
    end_date: data.end_date || '',
    expiryDate: data.expiry_date || '',
    expiry_date: data.expiry_date || '',
    contractLength: data.contract_length || 0,
    contractLengthUnit: data.contract_length_unit || 'months',
    overheadProfile: data.overhead_profile || '',
    userId: data.user_id || '',
    createdBy: data.created_by || '',
    created_by: data.created_by || ''
  };
}
