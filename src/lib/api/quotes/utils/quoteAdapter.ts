
// Add proper exports for adaptQuote, adaptQuotes, and prepareQuoteForApi
export function adaptQuote(dbQuote: any): any {
  return {
    id: dbQuote.id,
    name: dbQuote.name || '',
    title: dbQuote.title || '',
    client_name: dbQuote.client_name || '',
    clientName: dbQuote.client_name || '',
    site_name: dbQuote.site_name || '',
    siteName: dbQuote.site_name || '',
    status: dbQuote.status || 'draft',
    overhead_percentage: dbQuote.overhead_percentage || 0,
    margin_percentage: dbQuote.margin_percentage || 0,
    total_price: dbQuote.total_price || 0,
    labor_cost: dbQuote.labor_cost || 0,
    supplies_cost: dbQuote.supplies_cost || 0,
    equipment_cost: dbQuote.equipment_cost || 0,
    subcontractor_cost: dbQuote.subcontractor_cost || 0,
    created_at: dbQuote.created_at || new Date().toISOString(),
    updated_at: dbQuote.updated_at || new Date().toISOString(),
    quote_number: dbQuote.quote_number || '',
    valid_until: dbQuote.valid_until || '',
    client_id: dbQuote.client_id || '',
    site_id: dbQuote.site_id || '',
    
    // Duplicate fields for compatibility
    clientContact: dbQuote.client_contact || '',
    client_contact: dbQuote.client_contact || '',
    clientEmail: dbQuote.client_email || '',
    client_email: dbQuote.client_email || '',
    clientPhone: dbQuote.client_phone || '',
    client_phone: dbQuote.client_phone || '',
    siteAddress: dbQuote.site_address || '',
    site_address: dbQuote.site_address || '',
    
    // More fields
    description: dbQuote.description || '',
    notes: dbQuote.notes || '',
    frequency: dbQuote.frequency || '',
    scope: dbQuote.scope || '',
    terms: dbQuote.terms || '',
    
    // Cost fields
    overhead_cost: dbQuote.overhead_cost || 0,
    overheadCost: dbQuote.overhead_cost || 0,
    total_cost: dbQuote.total_cost || 0,
    totalCost: dbQuote.total_cost || 0,
    margin_amount: dbQuote.margin_amount || 0,
    marginAmount: dbQuote.margin_amount || 0,
    
    // Dates
    startDate: dbQuote.start_date || '',
    start_date: dbQuote.start_date || '',
    endDate: dbQuote.end_date || '',
    end_date: dbQuote.end_date || '',
    expiryDate: dbQuote.expiry_date || '',
    expiry_date: dbQuote.expiry_date || '',
    
    // Additional fields
    contractLength: dbQuote.contract_length || 0,
    contractLengthUnit: dbQuote.contract_length_unit || 'months',
    overheadProfile: dbQuote.overhead_profile || '',
    userId: dbQuote.user_id || '',
    createdBy: dbQuote.created_by || '',
    created_by: dbQuote.created_by || '',
    
    // Required duplicated properties
    overheadPercentage: dbQuote.overhead_percentage || 0,
    marginPercentage: dbQuote.margin_percentage || 0,
    totalPrice: dbQuote.total_price || 0,
    laborCost: dbQuote.labor_cost || 0,
    suppliesCost: dbQuote.supplies_cost || 0,
    equipmentCost: dbQuote.equipment_cost || 0,
    subcontractorCost: dbQuote.subcontractor_cost || 0,
    createdAt: dbQuote.created_at || new Date().toISOString(),
    updatedAt: dbQuote.updated_at || new Date().toISOString(),
    quoteNumber: dbQuote.quote_number || '',
    validUntil: dbQuote.valid_until || '',
    clientId: dbQuote.client_id || '',
    siteId: dbQuote.site_id || '',
  };
}

export function adaptQuotes(dbQuotes: any[]): any[] {
  return dbQuotes.map(adaptQuote);
}

export function prepareQuoteForApi(quote: any): any {
  const dbQuote: any = {
    // Map fields for the database
    name: quote.name || '',
    title: quote.title || quote.name || '',
    client_name: quote.clientName || quote.client_name || '',
    site_name: quote.siteName || quote.site_name || '',
    status: quote.status || 'draft',
    overhead_percentage: quote.overheadPercentage || quote.overhead_percentage || 0,
    margin_percentage: quote.marginPercentage || quote.margin_percentage || 0,
    total_price: quote.totalPrice || quote.total_price || 0,
    labor_cost: quote.laborCost || quote.labor_cost || 0,
    supplies_cost: quote.suppliesCost || quote.supplies_cost || 0,
    equipment_cost: quote.equipmentCost || quote.equipment_cost || 0,
    subcontractor_cost: quote.subcontractorCost || quote.subcontractor_cost || 0,
    quote_number: quote.quoteNumber || quote.quote_number || '',
    valid_until: quote.validUntil || quote.valid_until || '',
    client_id: quote.clientId || quote.client_id || '',
    site_id: quote.siteId || quote.site_id || '',
    
    // Additional fields
    contract_length: quote.contractLength || 0,
    contract_length_unit: quote.contractLengthUnit || 'months',
    description: quote.description || '',
    notes: quote.notes || '',
    client_contact: quote.clientContact || '',
    client_email: quote.clientEmail || '',
    client_phone: quote.clientPhone || '',
    site_address: quote.siteAddress || '',
    frequency: quote.frequency || '',
    scope: quote.scope || '',
    terms: quote.terms || '',
    overhead_cost: quote.overheadCost || quote.overhead_cost || 0,
    total_cost: quote.totalCost || quote.total_cost || 0,
    margin_amount: quote.marginAmount || quote.margin_amount || 0,
    start_date: quote.startDate || quote.start_date || '',
    end_date: quote.endDate || quote.end_date || '',
    expiry_date: quote.expiryDate || quote.expiry_date || '',
    overhead_profile: quote.overheadProfile || '',
    user_id: quote.userId || '',
    created_by: quote.createdBy || quote.created_by || '',
  };
  
  // If it's an update, include the id
  if (quote.id) {
    dbQuote.id = quote.id;
  }
  
  return dbQuote;
}
