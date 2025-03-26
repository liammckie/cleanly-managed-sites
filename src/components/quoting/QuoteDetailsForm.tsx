
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote } from '@/types/models';

interface QuoteDetailsFormProps {
  quote: Quote;
  onUpdate: (field: string, value: any) => void;
}

export function QuoteDetailsForm({ quote, onUpdate }: QuoteDetailsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p><strong>Quote Name:</strong> {quote.name}</p>
            <p><strong>Client:</strong> {quote.clientName}</p>
            <p><strong>Site:</strong> {quote.siteName}</p>
            <p><strong>Status:</strong> {quote.status}</p>
          </div>
          <div className="space-y-2">
            <p><strong>Total Price:</strong> ${quote.totalPrice.toFixed(2)}</p>
            <p><strong>Labor Cost:</strong> ${quote.laborCost.toFixed(2)}</p>
            <p><strong>Overhead %:</strong> {quote.overheadPercentage}%</p>
            <p><strong>Margin %:</strong> {quote.marginPercentage}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
