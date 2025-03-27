import { Quote, QuoteShift } from '@/lib/types/quotes';

// Updated adaptQuoteData function
export function adaptQuoteData(quote: any): Quote {
  return {
    ...quote,
    // Ensure all properties match the expected format in the Quote interface
    id: quote.id,
    name: quote.name || '',
    title: quote.title || '',
    client_name: quote.clientName || quote.client_name || '',
    clientName: quote.clientName || quote.client_name || '',
    site_name: quote.siteName || quote.site_name || '',
    siteName: quote.siteName || quote.site_name || '',
    status: quote.status || 'draft',
    overhead_percentage: quote.overheadPercentage || quote.overhead_percentage || 15,
    margin_percentage: quote.marginPercentage || quote.margin_percentage || 20,
    total_price: quote.totalPrice || quote.total_price || 0,
    labor_cost: quote.laborCost || quote.labor_cost || 0,
    supplies_cost: quote.suppliesCost || quote.supplies_cost || 0,
    equipment_cost: quote.equipmentCost || quote.equipment_cost || 0,
    subcontractor_cost: quote.subcontractorCost || quote.subcontractor_cost || 0,
    created_at: quote.createdAt || quote.created_at || new Date().toISOString(),
    updated_at: quote.updatedAt || quote.updated_at || new Date().toISOString(),
    notes: quote.notes || '',
    
    // These fields are used by components but not always required by the API
    overheadPercentage: quote.overhead_percentage || quote.overheadPercentage || 15,
    marginPercentage: quote.margin_percentage || quote.marginPercentage || 20,
    totalPrice: quote.total_price || quote.totalPrice || 0,
    laborCost: quote.labor_cost || quote.laborCost || 0,
    subcontractorCost: quote.subcontractor_cost || quote.subcontractorCost || 0,
    createdAt: quote.created_at || quote.createdAt || new Date().toISOString(),
    updatedAt: quote.updated_at || quote.updatedAt || new Date().toISOString(),
    
    // Optional fields with safe defaults
    shifts: quote.shifts || [],
    subcontractors: quote.subcontractors || [],
  };
}

// Adapt shift data between different formats
export function adaptShiftData(shift: any): QuoteShift {
  return {
    id: shift.id || '',
    quoteId: shift.quoteId || shift.quote_id || '',
    day: shift.day || 'monday',
    startTime: shift.startTime || shift.start_time || '09:00',
    endTime: shift.endTime || shift.end_time || '17:00',
    breakDuration: shift.breakDuration || shift.break_duration || 30,
    numberOfCleaners: shift.numberOfCleaners || shift.number_of_cleaners || 1,
    employmentType: shift.employmentType || shift.employment_type || 'casual',
    level: shift.level || 1,
    allowances: shift.allowances || [],
    estimatedCost: shift.estimatedCost || shift.estimated_cost || 0,
    location: shift.location || '',
    notes: shift.notes || ''
  };
}

// Convert between API and UI formats
export function convertQuoteForApi(quote: Quote): any {
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
    client_id: quote.client_id || quote.clientId,
    site_id: quote.site_id || quote.siteId,
    start_date: quote.start_date || quote.startDate,
    end_date: quote.end_date || quote.endDate,
    expiry_date: quote.expiry_date || quote.expiryDate,
    // Other fields follow the same pattern
  };
}

// Convert from API format to UI format
export function convertQuoteFromApi(apiQuote: any): Quote {
  return {
    id: apiQuote.id,
    name: apiQuote.name,
    title: apiQuote.title,
    client_name: apiQuote.client_name,
    clientName: apiQuote.client_name,
    site_name: apiQuote.site_name,
    siteName: apiQuote.site_name,
    description: apiQuote.description,
    status: apiQuote.status,
    overhead_percentage: apiQuote.overhead_percentage,
    overheadPercentage: apiQuote.overhead_percentage,
    margin_percentage: apiQuote.margin_percentage,
    marginPercentage: apiQuote.margin_percentage,
    total_price: apiQuote.total_price,
    totalPrice: apiQuote.total_price,
    labor_cost: apiQuote.labor_cost,
    laborCost: apiQuote.labor_cost,
    supplies_cost: apiQuote.supplies_cost,
    suppliesCost: apiQuote.supplies_cost,
    equipment_cost: apiQuote.equipment_cost,
    equipmentCost: apiQuote.equipment_cost,
    subcontractor_cost: apiQuote.subcontractor_cost,
    subcontractorCost: apiQuote.subcontractor_cost,
    created_at: apiQuote.created_at,
    createdAt: apiQuote.created_at,
    updated_at: apiQuote.updated_at,
    updatedAt: apiQuote.updated_at,
    notes: apiQuote.notes || '',
    shifts: apiQuote.shifts || [],
    subcontractors: apiQuote.subcontractors || [],
    // Include all other properties needed by the UI
  };
}
