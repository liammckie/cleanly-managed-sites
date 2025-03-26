
import { Frequency } from '@/lib/award/types';
import { QuoteSubcontractor } from '@/lib/types/award/types';

/**
 * Converts DB subcontractor data to the QuoteSubcontractor model
 */
export function convertDbSubcontractorToModel(dbSubcontractor: any): QuoteSubcontractor {
  return {
    id: dbSubcontractor.id,
    quoteId: dbSubcontractor.quote_id,
    name: dbSubcontractor.name,
    description: dbSubcontractor.description || '',
    cost: dbSubcontractor.cost,
    frequency: dbSubcontractor.frequency as Frequency,
    email: dbSubcontractor.email || undefined,
    phone: dbSubcontractor.phone || undefined,
    service: dbSubcontractor.service || undefined,
    notes: dbSubcontractor.notes || undefined,
    services: dbSubcontractor.services || [],
    customServices: dbSubcontractor.custom_services || undefined,
    monthlyCost: dbSubcontractor.monthly_cost || undefined,
    isFlatRate: dbSubcontractor.is_flat_rate || false
  };
}

/**
 * Converts a QuoteSubcontractor model to a DB-ready object
 */
export function convertModelSubcontractorToDb(subcontractor: Partial<QuoteSubcontractor>): any {
  return {
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
