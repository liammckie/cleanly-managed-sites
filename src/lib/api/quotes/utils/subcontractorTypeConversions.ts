
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
    
    // Add camelCase aliases
    quoteId: dbSubcontractor.quote_id || ''
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
    notes: subcontractor.notes
  };
}
