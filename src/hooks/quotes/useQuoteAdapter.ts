
import { Quote } from '@/types/models';
import { QuoteDTO } from '@/types/dto';
import { adaptQuote } from '@/utils/typeAdapters';

export const useQuoteAdapter = () => {
  const adaptQuoteToFrontend = (dto: QuoteDTO): Quote => {
    return adaptQuote(dto) as unknown as Quote;
  };
  
  return {
    adaptQuoteToFrontend
  };
};
