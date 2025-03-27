
import { Quote } from '@/types/models';
import { adaptQuote } from '@/utils/typeAdapters';
import { QuoteDTO } from '@/types/dto';

/**
 * Ensures a quote object has all required properties from the Quote type
 */
export const ensureCompleteQuote = (partialQuote: any): Quote => {
  // Start with a complete quote to ensure all required properties exist
  const baseQuote: Quote = {
    id: '',
    clientName: '',
    status: 'draft',
    totalPrice: 0,
    laborCost: 0,
    overheadPercentage: 15,
    marginPercentage: 20,
    subcontractorCost: 0,
    createdAt: '',
    updatedAt: '',
    name: '',
    shifts: [],
    subcontractors: []
  };
  
  // Use the adapter function but include our complete base quote
  const adaptedQuote = adaptQuote(partialQuote);
  
  // Type assertion to resolve the status type issue
  return {
    ...baseQuote,
    ...adaptedQuote
  } as unknown as Quote;
};

/**
 * Ensures an array of quotes have all required properties
 */
export const ensureCompleteQuotes = (partialQuotes: any[]): Quote[] => {
  return partialQuotes.map(ensureCompleteQuote);
};
