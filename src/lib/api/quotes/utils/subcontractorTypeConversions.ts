
import { QuoteSubcontractor } from '@/lib/types/quotes';

export function convertToQuoteSubcontractor(data: any): QuoteSubcontractor {
  return {
    id: data.id || '',
    quoteId: data.quote_id || '',
    name: data.name || '',
    description: data.description || '', // Provide default for required field
    cost: data.cost || 0,
    frequency: data.frequency || 'monthly',
    email: data.email,
    phone: data.phone,
    notes: data.notes,
    services: data.services,
    service: data.service
  };
}

export function prepareQuoteSubcontractorForApi(subcontractor: QuoteSubcontractor): any {
  return {
    id: subcontractor.id,
    quote_id: subcontractor.quoteId,
    name: subcontractor.name,
    description: subcontractor.description || '',
    cost: subcontractor.cost,
    frequency: subcontractor.frequency,
    email: subcontractor.email,
    phone: subcontractor.phone,
    notes: subcontractor.notes,
    service: subcontractor.service
  };
}
