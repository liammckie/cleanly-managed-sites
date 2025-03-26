
import React from 'react';
import { Quote } from '@/lib/types/quotes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export interface QuoteStatsProps {
  pending: number;
  approved: number;
  total: number;
  value: number;
  average: number;
}

export function QuoteStats({ pending, approved, total, value, average }: QuoteStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Pending Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pending}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Approved Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approved}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(value)}</div>
          <div className="text-sm text-muted-foreground">Average: {formatCurrency(average)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
