
import { QuoteSubcontractor } from '@/lib/types/quotes';
import { toFrequency } from './quoteDbTypeAdapter';

// Convert database subcontractor record to QuoteSubcontractor
export function convertToQuoteSubcontractor(record: any): QuoteSubcontractor {
  return {
    id: record.id,
    quoteId: record.quote_id,
    name: record.name,
    description: record.description || '',
    cost: Number(record.cost) || 0,
    frequency: toFrequency(record.frequency || 'monthly'),
    email: record.email || '',
    phone: record.phone || '',
    notes: record.notes || '',
    service: record.service || '',
    customServices: record.custom_services || '',
    monthlyCost: Number(record.monthly_cost) || 0,
    isFlatRate: record.is_flat_rate || false,
    is_flat_rate: record.is_flat_rate || false,
    monthly_cost: Number(record.monthly_cost) || 0,
    business_name: record.business_name || '',
    contact_name: record.contact_name || '',
  };
}

// Prepare QuoteSubcontractor for API
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
    notes: subcontractor.notes,
    service: subcontractor.service,
    custom_services: subcontractor.customServices,
    monthly_cost: subcontractor.monthlyCost || subcontractor.monthly_cost,
    is_flat_rate: subcontractor.isFlatRate || subcontractor.is_flat_rate,
    business_name: subcontractor.business_name,
    contact_name: subcontractor.contact_name,
  };
}
