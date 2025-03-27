import { Quote } from '@/types/models';
import { QuoteDTO } from '@/types/dto';
import { adaptQuote } from '@/utils/typeAdapters';

/**
 * Ensures a quote object has all required properties
 */
export const ensureCompleteQuote = (quote: any): Quote => {
  if (!quote) return null;
  
  // Set default values for any missing properties
  return {
    id: quote.id || '',
    name: quote.name || '',
    client_name: quote.client_name || quote.clientName || '',
    clientName: quote.client_name || quote.clientName || '',
    site_name: quote.site_name || quote.siteName || '',
    siteName: quote.site_name || quote.siteName || '',
    status: quote.status || 'draft',
    overhead_percentage: quote.overhead_percentage || quote.overheadPercentage || 0,
    overheadPercentage: quote.overhead_percentage || quote.overheadPercentage || 0,
    margin_percentage: quote.margin_percentage || quote.marginPercentage || 0,
    marginPercentage: quote.margin_percentage || quote.marginPercentage || 0,
    total_price: quote.total_price || quote.totalPrice || 0,
    totalPrice: quote.total_price || quote.totalPrice || 0,
    labor_cost: quote.labor_cost || quote.laborCost || 0,
    laborCost: quote.labor_cost || quote.laborCost || 0,
    subcontractor_cost: quote.subcontractor_cost || quote.subcontractorCost || 0,
    subcontractorCost: quote.subcontractor_cost || quote.subcontractorCost || 0,
    created_at: quote.created_at || quote.createdAt || new Date().toISOString(),
    createdAt: quote.created_at || quote.createdAt || new Date().toISOString(),
    updated_at: quote.updated_at || quote.updatedAt || new Date().toISOString(),
    updatedAt: quote.updated_at || quote.updatedAt || new Date().toISOString(),
    
    // Optional properties with defaults
    supplies_cost: quote.supplies_cost || quote.suppliesCost || 0,
    suppliesCost: quote.supplies_cost || quote.suppliesCost || 0,
    equipment_cost: quote.equipment_cost || quote.equipmentCost || 0,
    equipmentCost: quote.equipment_cost || quote.equipmentCost || 0,
    overhead_cost: quote.overhead_cost || quote.overheadCost || 0,
    overheadCost: quote.overhead_cost || quote.overheadCost || 0,
    total_cost: quote.total_cost || quote.totalCost || 0,
    totalCost: quote.total_cost || quote.totalCost || 0,
    margin_amount: quote.margin_amount || quote.marginAmount || 0,
    marginAmount: quote.margin_amount || quote.marginAmount || 0,
    notes: quote.notes || '',
    
    // Array properties
    shifts: quote.shifts || [],
    subcontractors: quote.subcontractors || [],
    
    // Keep any other properties
    ...quote
  };
};

/**
 * Ensures an array of quotes all have the required properties
 */
export const ensureCompleteQuotes = (quotes: any[]): Quote[] => {
  if (!quotes) return [];
  return quotes.map(ensureCompleteQuote);
};

export const useQuoteAdapter = () => {
  const adaptQuoteToFrontend = (dto: QuoteDTO): Quote => {
    return adaptQuote(dto) as unknown as Quote;
  };
  
  return {
    adaptQuoteToFrontend
  };
};
