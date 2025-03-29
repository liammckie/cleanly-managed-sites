
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuote } from '@/hooks/quotes/useQuote';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { QuoteStatusBadge } from '@/components/quoting/QuoteStatusBadge';
import { format } from 'date-fns';
import { ArrowLeft, FileText, Printer, Send } from 'lucide-react';
import { mapFromDb } from '@/lib/mappers';

export default function QuoteDetails() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const { quote, isLoading, error } = useQuote(quoteId);
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
        </div>
      </div>
    );
  }
  
  if (error || !quote) {
    return (
      <div className="container py-8">
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          <h2 className="text-lg font-semibold mb-2">Error loading quote</h2>
          <p>{error?.message || 'Quote not found'}</p>
          <Button onClick={() => navigate('/quotes')} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Quotes
          </Button>
        </div>
      </div>
    );
  }
  
  // Convert snake_case to camelCase for consistent usage
  const mappedQuote = mapFromDb(quote);
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button onClick={() => navigate('/quotes')} variant="ghost" className="pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quotes
        </Button>
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{quote.name}</h1>
          <p className="text-muted-foreground">Client: {quote.client_name}</p>
          <p className="text-muted-foreground">Site: {quote.site_name || 'Not specified'}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <QuoteStatusBadge status={quote.status} />
          <p className="text-sm text-muted-foreground">Quote #{quote.id.substring(0, 8)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quote Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${quote.total_price.toFixed(2)}</p>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Labor: ${quote.labor_cost.toFixed(2)}</p>
              {quote.subcontractor_cost > 0 && <p>Subcontractors: ${quote.subcontractor_cost.toFixed(2)}</p>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p>{format(new Date(quote.created_at), 'PPP')}</p>
            </div>
            {quote.expiry_date && (
              <div>
                <p className="text-sm text-muted-foreground">Valid Until</p>
                <p>{format(new Date(quote.expiry_date), 'PPP')}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button className="w-full justify-start">
              <Send className="mr-2 h-4 w-4" /> Send to Client
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Printer className="mr-2 h-4 w-4" /> Print Quote
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate(`/quotes/${quoteId}/edit`)}
            >
              <FileText className="mr-2 h-4 w-4" /> Edit Quote
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional quote details would go here */}
      
      {/* Shift summary section, if there are any shifts */}
      {quote.shifts && quote.shifts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Shift Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quote.shifts.map((shift: any) => (
              <Card key={shift.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium capitalize">{shift.day}</h3>
                      <p className="text-sm text-muted-foreground">
                        {shift.start_time} - {shift.end_time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{shift.number_of_cleaners} staff</p>
                      <p className="text-sm text-muted-foreground">Level {shift.level}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
