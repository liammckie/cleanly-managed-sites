import { Quote } from '@/lib/types/quotes';
import { mapToDbQuote } from './utils/quoteDbTypeAdapter';

// Convert frontend quote model to database model
export const adaptQuoteForDatabase = (quote: Partial<Quote>) => {
  // Handle property name differences between frontend and database
  return {
    name: quote.name,
    user_id: quote.user_id, // Use snake_case for API
    site_name: quote.siteName,
    client_name: quote.clientName,
    start_date: quote.startDate,
    end_date: quote.endDate,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    expiry_date: quote.expiryDate,
    status: quote.status,
    total_price: quote.totalPrice,
    total_cost: quote.totalCost,
    labor_cost: quote.laborCost,
    supplies_cost: quote.suppliesCost,
    equipment_cost: quote.equipmentCost,
    subcontractor_cost: quote.subcontractorCost,
    overhead_cost: quote.overheadCost,
    margin_amount: quote.marginAmount,
    margin_percentage: quote.marginPercentage,
    overhead_percentage: quote.overheadPercentage,
    overhead_profile: quote.overhead_profile, // Match database field
    notes: quote.notes,
    created_by: quote.createdBy
  };
};

// Convert database Quote model to frontend model
export const adaptQuoteFromDatabase = (dbQuote: any): Quote => {
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    user_id: dbQuote.user_id,
    siteName: dbQuote.site_name,
    clientName: dbQuote.client_name,
    startDate: dbQuote.start_date,
    endDate: dbQuote.end_date,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit,
    expiryDate: dbQuote.expiry_date,
    status: dbQuote.status,
    totalPrice: dbQuote.total_price,
    totalCost: dbQuote.total_cost,
    laborCost: dbQuote.labor_cost,
    suppliesCost: dbQuote.supplies_cost,
    equipmentCost: dbQuote.equipment_cost,
    subcontractorCost: dbQuote.subcontractor_cost,
    overheadCost: dbQuote.overhead_cost,
    marginAmount: dbQuote.margin_amount,
    marginPercentage: dbQuote.margin_percentage,
    overheadPercentage: dbQuote.overhead_percentage,
    overhead_profile: dbQuote.overhead_profile,
    notes: dbQuote.notes,
    createdBy: dbQuote.created_by,
    createdAt: dbQuote.created_at,
    updatedAt: dbQuote.updated_at,
    // Other fields with default values
    shifts: [],
    subcontractors: []
  };
};
