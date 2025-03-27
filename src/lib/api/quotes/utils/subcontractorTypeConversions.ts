
import { Subcontractor } from '@/components/sites/forms/types/subcontractorTypes';
import { QuoteSubcontractor } from '@/types/models';
import { adaptFrequency } from '@/lib/utils/typeAdapters';

/**
 * Convert a site subcontractor to a quote subcontractor format
 */
export function convertToQuoteSubcontractor(sub: Subcontractor): QuoteSubcontractor {
  return {
    id: sub.id || crypto.randomUUID(),
    quoteId: '', // Will be set when assigned to a quote
    name: sub.business_name || '',
    description: sub.customServices || '',
    cost: typeof sub.monthly_cost === 'number' ? sub.monthly_cost : 0,
    frequency: adaptFrequency('monthly') as any, // Explicitly adapt the frequency
    email: sub.email || '',
    phone: sub.phone || '',
    services: Array.isArray(sub.services) ? sub.services : [],
    notes: ''
  };
}

/**
 * Convert multiple site subcontractors to quote subcontractors
 */
export function convertSubcontractorsToQuoteFormat(
  subcontractors: Subcontractor[]
): QuoteSubcontractor[] {
  if (!Array.isArray(subcontractors)) return [];
  return subcontractors.map(convertToQuoteSubcontractor);
}

/**
 * Prepare a quote subcontractor for API submission
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
    services: subcontractor.services
  };
}
