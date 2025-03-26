
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/dateUtils';
import { Quote } from '@/types/models';
import { adaptQuoteShift } from '@/utils/typeAdapters';
import { ApiQuoteDetailsProps } from '@/types/api';

export interface QuoteDetailsProps {
  quote: Quote;
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
};

// Get appropriate badge color based on quote status
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-200 text-gray-800';
    case 'sent':
      return 'bg-blue-100 text-blue-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'expired':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

export function QuoteDetails({ quote }: QuoteDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{quote.name || 'Untitled Quote'}</CardTitle>
            <Badge className={getStatusBadge(quote.status)}>
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{quote.clientName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Site</p>
                <p className="font-medium">{quote.siteName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(quote.createdAt, true)}</p>
              </div>
              {quote.startDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formatDate(quote.startDate)}</p>
                </div>
              )}
              {quote.endDate && (
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{formatDate(quote.endDate)}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Quote Value</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(quote.totalPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Labor Cost</p>
                <p className="font-medium">{formatCurrency(quote.laborCost)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subcontractor Cost</p>
                <p className="font-medium">{formatCurrency(quote.subcontractorCost)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overhead Rate</p>
                <p className="font-medium">{quote.overheadPercentage}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margin Rate</p>
                <p className="font-medium">{quote.marginPercentage}%</p>
              </div>
            </div>
          </div>
          
          {quote.description && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{quote.description}</p>
            </div>
          )}
          
          {quote.notes && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-muted-foreground">{quote.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {quote.shifts && quote.shifts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Labor Shifts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-2">Day</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Staff</th>
                    <th className="px-4 py-2">Employment</th>
                    <th className="px-4 py-2">Level</th>
                    <th className="px-4 py-2">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.shifts.map(shift => {
                    const adaptedShift = adaptQuoteShift(shift, shift);
                    return (
                      <tr key={adaptedShift.id} className="border-t">
                        <td className="px-4 py-2">{adaptedShift.day}</td>
                        <td className="px-4 py-2">
                          {adaptedShift.startTime} - {adaptedShift.endTime}
                        </td>
                        <td className="px-4 py-2">{adaptedShift.numberOfCleaners}</td>
                        <td className="px-4 py-2">{adaptedShift.employmentType}</td>
                        <td className="px-4 py-2">{adaptedShift.level}</td>
                        <td className="px-4 py-2">{formatCurrency(adaptedShift.estimatedCost)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {quote.subcontractors && quote.subcontractors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subcontractors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Service</th>
                    <th className="px-4 py-2">Frequency</th>
                    <th className="px-4 py-2">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.subcontractors.map(sub => (
                    <tr key={sub.id} className="border-t">
                      <td className="px-4 py-2">{sub.name}</td>
                      <td className="px-4 py-2">{sub.service || 'General'}</td>
                      <td className="px-4 py-2">{sub.frequency}</td>
                      <td className="px-4 py-2">{formatCurrency(sub.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
