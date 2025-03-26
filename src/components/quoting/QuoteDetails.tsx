
import React from 'react';
import { Quote } from '@/lib/types/award/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { QuoteStatusBadge } from './QuoteStatusBadge';
import { adaptQuote } from '@/lib/utils/typeAdapters';

export interface QuoteDetailsProps {
  quote: Quote;
}

export function QuoteDetails({ quote }: QuoteDetailsProps) {
  // Adapt the quote to meet the expected type
  const adaptedQuote = adaptQuote<typeof quote, Quote>(quote);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{adaptedQuote.name}</span>
          <QuoteStatusBadge status={adaptedQuote.status} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
            <p>{adaptedQuote.clientName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Site</h3>
            <p>{adaptedQuote.siteName || 'N/A'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Price</h3>
            <p className="font-semibold">{formatCurrency(adaptedQuote.totalPrice)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
            <p>{formatDate(adaptedQuote.createdAt)}</p>
          </div>
          
          {adaptedQuote.validUntil && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Valid Until</h3>
              <p>{formatDate(adaptedQuote.validUntil)}</p>
            </div>
          )}
          
          {adaptedQuote.quoteNumber && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Quote Number</h3>
              <p>{adaptedQuote.quoteNumber}</p>
            </div>
          )}
        </div>
        
        {adaptedQuote.notes && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
            <p className="text-sm mt-1">{adaptedQuote.notes}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Labor Cost</h3>
            <p className="text-sm">{formatCurrency(adaptedQuote.laborCost)}</p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Subcontractor Cost</h3>
            <p className="text-sm">{formatCurrency(adaptedQuote.subcontractorCost)}</p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Overhead</h3>
            <p className="text-sm">{formatCurrency(adaptedQuote.overheadCost || 0)} ({adaptedQuote.overheadPercentage}%)</p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Margin</h3>
            <p className="text-sm">{formatCurrency(adaptedQuote.marginAmount || 0)} ({adaptedQuote.marginPercentage}%)</p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Total Cost</h3>
            <p className="text-sm">{formatCurrency(adaptedQuote.totalCost || 0)}</p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Profit</h3>
            <p className="text-sm">{formatCurrency((adaptedQuote.totalPrice || 0) - (adaptedQuote.totalCost || 0))}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
