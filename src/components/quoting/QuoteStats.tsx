
import React from 'react';
import { Quote } from '@/lib/types/quotes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface QuoteStatsProps {
  quotes: Quote[];
  isLoading: boolean;
}

export function QuoteStats({ quotes, isLoading }: QuoteStatsProps) {
  if (isLoading) {
    return <QuoteStatsLoading />;
  }

  const totalQuotes = quotes.length;
  const draftQuotes = quotes.filter(q => q.status === 'draft').length;
  const sentQuotes = quotes.filter(q => q.status === 'sent').length;
  const approvedQuotes = quotes.filter(q => q.status === 'approved').length;
  
  const totalValue = quotes.reduce((sum, quote) => {
    const price = quote.total_price || quote.totalPrice || 0;
    return sum + price;
  }, 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Total Quotes" value={totalQuotes.toString()} />
      <StatsCard title="Draft" value={draftQuotes.toString()} />
      <StatsCard title="Sent" value={sentQuotes.toString()} />
      <StatsCard title="Total Value" value={formatCurrency(totalValue) || "$0"} />
    </div>
  );
}

function StatsCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function QuoteStatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map(i => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
