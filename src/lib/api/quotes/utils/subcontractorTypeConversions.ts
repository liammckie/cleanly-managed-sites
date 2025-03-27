
import { v4 as uuidv4 } from 'uuid';
import { QuoteSubcontractor } from '@/lib/types/quotes';

export function dbToSubcontractor(dbSubcontractor: any): QuoteSubcontractor {
  return {
    id: dbSubcontractor.id || uuidv4(),
    quote_id: dbSubcontractor.quote_id || '',
    name: dbSubcontractor.name || '',
    description: dbSubcontractor.description || '',
    cost: dbSubcontractor.cost || 0,
    frequency: dbSubcontractor.frequency || 'monthly',
    email: dbSubcontractor.email || '',
    phone: dbSubcontractor.phone || '',
    notes: dbSubcontractor.notes || '',
    
    // Add camelCase alias
    quoteId: dbSubcontractor.quote_id || '',
    
    // Additional fields used in UI
    service: dbSubcontractor.service || '',
    services: dbSubcontractor.services || [],
    customServices: dbSubcontractor.custom_services || '',
    monthlyCost: dbSubcontractor.monthly_cost || 0,
    isFlatRate: dbSubcontractor.is_flat_rate !== false
  };
}

export function subcontractorToDb(subcontractor: QuoteSubcontractor): any {
  return {
    id: subcontractor.id,
    quote_id: subcontractor.quote_id || subcontractor.quoteId,
    name: subcontractor.name,
    description: subcontractor.description,
    cost: subcontractor.cost,
    frequency: subcontractor.frequency,
    email: subcontractor.email,
    phone: subcontractor.phone,
    notes: subcontractor.notes,
    
    // Additional fields from UI
    service: subcontractor.service || '',
    services: subcontractor.services || [],
    custom_services: subcontractor.customServices || '',
    monthly_cost: subcontractor.monthlyCost || 0,
    is_flat_rate: subcontractor.isFlatRate !== false
  };
}

// Alias functions for API conversion
export const convertToQuoteSubcontractor = dbToSubcontractor;
export const prepareQuoteSubcontractorForApi = subcontractorToDb;
