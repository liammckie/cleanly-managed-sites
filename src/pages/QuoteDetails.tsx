
import React from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { useQuote } from '@/hooks/quotes/useQuote';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { QuoteDetails } from '@/components/quoting/QuoteDetails';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adaptQuote } from '@/lib/utils/typeAdapters';

const QuoteDetailsPage = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const { data: quote, isLoading, error } = useQuote(quoteId!);
  const navigate = useNavigate();
  
  return (
    <PageLayout>
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/quotes')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quotes
        </Button>
        
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
            quote={adaptQuote<typeof quote, import('@/lib/types/award/types').Quote>(quote)} 
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
