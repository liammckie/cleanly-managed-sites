
import React from 'react';
import { Quote } from '@/lib/types/quotes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface QuoteStatsProps {
  quotes: Quote[];
}

export function QuoteStats({ quotes }: QuoteStatsProps) {
  const totalQuotes = quotes.length;
  const draftQuotes = quotes.filter(q => q.status === 'draft').length;
  const sentQuotes = quotes.filter(q => q.status === 'sent').length;
  const approvedQuotes = quotes.filter(q => q.status === 'approved').length;
  
  const totalValue = quotes
    .filter(q => q.status === 'approved')
    .reduce((sum, quote) => sum + (quote.totalPrice || quote.total_price || 0), 0);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuotes}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Draft Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{draftQuotes}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Sent Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sentQuotes}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Approved Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <div className="text-sm text-muted-foreground">{approvedQuotes} quotes</div>
        </CardContent>
      </Card>
    </div>
  );
}
