
import { Frequency } from '@/lib/award/types';
import { QuoteSubcontractor } from '@/lib/types/quotes';

/**
 * Converts API response data to strongly typed QuoteSubcontractor objects
 */
export function convertToQuoteSubcontractor(apiData: any): QuoteSubcontractor {
  return {
    id: apiData.id,
    quoteId: apiData.quote_id,
    name: apiData.name,
    description: apiData.description || '',
    cost: apiData.cost,
    frequency: apiData.frequency as Frequency,
    email: apiData.email || '',
    phone: apiData.phone || '',
    service: apiData.service || '',
    notes: apiData.notes || '',
    services: apiData.services || [],
    customServices: apiData.custom_services || '',
    monthlyCost: apiData.monthly_cost || null,
    isFlatRate: apiData.is_flat_rate || true
  };
}

/**
 * Prepares QuoteSubcontractor data for API submission
 */
export function prepareQuoteSubcontractorForApi(subcontractor: QuoteSubcontractor): any {
  return {
    id: subcontractor.id,
    quote_id: subcontractor.quoteId,
    name: subcontractor.name,
    description: subcontractor.description,
    cost: subcontractor.cost,
    frequency: subcontractor.frequency,
    email: subcontractor.email,
    phone: subcontractor.phone,
    service: subcontractor.service,
    notes: subcontractor.notes,
    services: subcontractor.services,
    custom_services: subcontractor.customServices,
    monthly_cost: subcontractor.monthlyCost,
    is_flat_rate: subcontractor.isFlatRate
  };
}
