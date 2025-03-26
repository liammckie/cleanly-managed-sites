
import React from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useQuote } from '@/hooks/quotes/useQuote';
import { QuoteDetails } from '@/components/quoting/QuoteDetails';
import { adaptQuote } from '@/lib/utils/typeAdapters';
import { Quote } from '@/lib/types/award/types';

const QuoteDetailsPage = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const { data: quote, isLoading, error } = useQuote(quoteId!);
  
  const handleQuoteSelect = (id: string) => {
    // Since we're already on the quote details page, this is a no-op
    console.log(`Quote selected: ${id}`);
  };
  
  return (
    <PageLayout>
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-destructive">
            <h3 className="text-xl font-semibold mb-2">Error Loading Quote</h3>
            <p>{(error as any)?.message || 'Unable to load quote details'}</p>
          </div>
        ) : quote ? (
          <QuoteDetails 
            quote={adaptQuote<typeof quote, Quote>(quote)} 
            onQuoteSelect={handleQuoteSelect}
          />
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Quote Not Found</h3>
            <p>The requested quote could not be found.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default QuoteDetailsPage;
