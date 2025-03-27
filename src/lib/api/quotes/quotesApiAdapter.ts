
import { Quote } from '@/lib/types/quotes';

export function adaptQuoteForServer(quote: Partial<Quote>): any {
  // Add any server-side adaptations here
  return {
    ...quote,
    // Map frontend properties to backend properties if needed
    user_id: quote.userId,
    client_name: quote.clientName,
    site_name: quote.siteName,
    labor_cost: quote.laborCost,
    overhead_cost: quote.overheadCost,
    overhead_percentage: quote.overheadPercentage,
    margin_amount: quote.marginAmount,
    margin_percentage: quote.marginPercentage,
    total_cost: quote.totalCost,
    total_price: quote.totalPrice,
    subcontractor_cost: quote.subcontractorCost,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    overhead_profile: quote.overheadProfile
    // equipmentCost is not needed in the backend
  };
}

export function adaptQuoteFromServer(serverQuote: any): Partial<Quote> {
  // Add any client-side adaptations here
  return {
    ...serverQuote,
    // Map backend properties to frontend properties
    id: serverQuote.id,
    userId: serverQuote.user_id,
    clientName: serverQuote.client_name,
    siteName: serverQuote.site_name,
    laborCost: serverQuote.labor_cost,
    overheadCost: serverQuote.overhead_cost,
    overheadPercentage: serverQuote.overhead_percentage,
    marginAmount: serverQuote.margin_amount,
    marginPercentage: serverQuote.margin_percentage,
    totalCost: serverQuote.total_cost,
    totalPrice: serverQuote.total_price,
    subcontractorCost: serverQuote.subcontractor_cost,
    contractLength: serverQuote.contract_length,
    contractLengthUnit: serverQuote.contract_length_unit,
    overheadProfile: serverQuote.overhead_profile,
    // Client-side only property
    isDirty: false
  };
}
