
import React from 'react';
import { Quote } from '@/lib/types/award/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { QuoteStatusBadge } from './QuoteStatusBadge';

export interface QuoteDetailsProps {
  quote: Quote;
  onQuoteSelect?: (quoteId: string) => void;
}

export function QuoteDetails({ quote, onQuoteSelect }: QuoteDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{quote.name}</span>
          <QuoteStatusBadge status={quote.status} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
            <p>{quote.clientName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Site</h3>
            <p>{quote.siteName || 'N/A'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Price</h3>
            <p className="font-semibold">{formatCurrency(quote.totalPrice)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
            <p>{formatDate(quote.createdAt)}</p>
          </div>
          
          {quote.validUntil && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Valid Until</h3>
              <p>{formatDate(quote.validUntil)}</p>
            </div>
          )}
          
          {quote.quoteNumber && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Quote Number</h3>
              <p>{quote.quoteNumber}</p>
            </div>
          )}
        </div>
        
        {quote.notes && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
            <p className="text-sm mt-1">{quote.notes}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Labor Cost</h3>
            <p className="text-sm">{formatCurrency(quote.laborCost)}</p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Subcontractor Cost</h3>
            <p className="text-sm">{formatCurrency(quote.subcontractorCost)}</p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Overhead</h3>
            <p className="text-sm">{formatCurrency(quote.overheadCost || 0)} ({quote.overheadPercentage}%)</p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Margin</h3>
            <p className="text-sm">{formatCurrency(quote.marginAmount || 0)} ({quote.marginPercentage}%)</p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Total Cost</h3>
            <p className="text-sm">{formatCurrency(quote.totalCost || 0)}</p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-muted-foreground">Profit</h3>
            <p className="text-sm">{formatCurrency((quote.totalPrice || 0) - (quote.totalCost || 0))}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
