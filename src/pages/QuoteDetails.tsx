
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { fetchQuote } from '@/lib/api/quotes/quotesApi';
import { QuoteDetails as QuoteDetailsComponent } from '@/components/quoting/QuoteDetails';
import { adaptQuoteShift } from '@/utils/typeAdapters';

export default function QuoteDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: quote, isLoading, error } = useQuery({
    queryKey: ['quote', id],
    queryFn: () => id ? fetchQuote(id) : Promise.reject('No quote ID provided'),
    enabled: !!id
  });
  
  const handleBack = () => navigate(-1);
  
  const handleQuoteSelect = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !quote) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load quote details'}
          </AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Quote Details</h1>
        </div>
        <Button onClick={() => navigate(`/quotes/${quote.id}/edit`)}>
          Edit Quote
        </Button>
      </div>
      
      <QuoteDetailsComponent
        quote={{
          ...quote,
          shifts: quote.shifts?.map(shift => adaptQuoteShift(shift, shift))
        }}
      />
    </div>
  );
}
