import { Quote } from '@/lib/types';

// Convert from database format to API format
export const adaptQuoteFromDb = (dbQuote: any): Quote => {
  return {
    ...dbQuote,
    // Convert snake_case to camelCase fields
    userId: dbQuote.user_id || null,
    clientName: dbQuote.client_name || null,
    siteName: dbQuote.site_name || null,
    contractLength: dbQuote.contract_length || null,
    contractLengthUnit: dbQuote.contract_length_unit || null,
    overheadProfile: dbQuote.overhead_profile || 'standard',
    overheadPercentage: dbQuote.overhead_percentage || 15,
    // For new fields that aren't present in the Quote type,
    // add them with a consistent format
    suppliesCost: dbQuote.supplies_cost || 0,
    equipmentCost: dbQuote.equipment_cost || 0,
    // ... any other field conversions
  };
};

// Convert from API format to database format
export const adaptQuoteForDb = (quote: Partial<Quote>): any => {
  return {
    ...quote,
    // Convert camelCase to snake_case fields
    user_id: quote.user_id || null,
    client_name: quote.client_name || null,
    site_name: quote.site_name || null,
    contract_length: quote.contract_length || null,
    contract_length_unit: quote.contract_length_unit || null,
    overhead_profile: quote.overhead_profile || 'standard',
    overhead_percentage: quote.overhead_percentage || 15,
    // For new fields that aren't present in the Quote type,
    // add them with a consistent format
    supplies_cost: quote.supplies_cost || 0,
    equipment_cost: quote.equipment_cost || 0,
    // ... any other field conversions
  };
};
