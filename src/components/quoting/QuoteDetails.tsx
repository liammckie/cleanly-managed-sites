
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuoteShift, QuoteSubcontractor } from '@/types/models';
import { QuoteDetailsProps } from '@/components/quoting/types';

export const QuoteDetails: React.FC<QuoteDetailsProps> = ({ quote }) => {
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-yellow-200 text-yellow-800';
      case 'sent':
        return 'bg-blue-200 text-blue-800';
      case 'approved':
        return 'bg-green-200 text-green-800';
      case 'rejected':
        return 'bg-red-200 text-red-800';
      case 'expired':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-bold">{quote.name}</CardTitle>
          <Badge className={getStatusColor(quote.status)}>
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{quote.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Site</p>
                <p className="font-medium">{quote.siteName}</p>
              </div>
              {quote.quoteNumber && (
                <div>
                  <p className="text-sm text-muted-foreground">Quote Number</p>
                  <p className="font-medium">{quote.quoteNumber}</p>
                </div>
              )}
              {quote.validUntil && (
                <div>
                  <p className="text-sm text-muted-foreground">Valid Until</p>
                  <p className="font-medium">{new Date(quote.validUntil).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-xl font-bold">{formatCurrency(quote.totalPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Labor Cost</p>
                <p className="font-medium">{formatCurrency(quote.laborCost)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overhead ({quote.overheadPercentage}%)</p>
                <p className="font-medium">{formatCurrency((quote.laborCost * quote.overheadPercentage) / 100)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margin ({quote.marginPercentage}%)</p>
                <p className="font-medium">{formatCurrency((quote.totalPrice - quote.laborCost) * (quote.marginPercentage / 100))}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="shifts">
        <TabsList>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="subcontractors">Subcontractors</TabsTrigger>
          {quote.notes && <TabsTrigger value="notes">Notes</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="shifts">
          <Card>
            <CardHeader>
              <CardTitle>Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              {quote.shifts && quote.shifts.length > 0 ? (
                <div className="space-y-4">
                  {quote.shifts.map((shift) => (
                    <ShiftItem key={shift.id} shift={shift} />
                  ))}
                </div>
              ) : (
                <p>No shifts added to this quote.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subcontractors">
          <Card>
            <CardHeader>
              <CardTitle>Subcontractors</CardTitle>
            </CardHeader>
            <CardContent>
              {quote.subcontractors && quote.subcontractors.length > 0 ? (
                <div className="space-y-4">
                  {quote.subcontractors.map((subcontractor) => (
                    <SubcontractorItem key={subcontractor.id} subcontractor={subcontractor} />
                  ))}
                </div>
              ) : (
                <p>No subcontractors added to this quote.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {quote.notes && (
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{quote.notes}</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

interface ShiftItemProps {
  shift: QuoteShift;
}

const ShiftItem: React.FC<ShiftItemProps> = ({ shift }) => {
  // Format day string to be more readable
  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <div className="p-4 border rounded-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <h3 className="font-medium">
          {formatDay(shift.day)} ({shift.startTime} - {shift.endTime})
        </h3>
        <Badge variant="outline">{shift.employmentType}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Cleaners:</span> {shift.numberOfCleaners}
        </div>
        <div>
          <span className="text-muted-foreground">Break:</span> {shift.breakDuration} mins
        </div>
        <div>
          <span className="text-muted-foreground">Level:</span> {shift.level}
        </div>
      </div>
      {shift.location && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Location:</span> {shift.location}
        </div>
      )}
      {shift.notes && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Notes:</span> {shift.notes}
        </div>
      )}
    </div>
  );
};

interface SubcontractorItemProps {
  subcontractor: QuoteSubcontractor;
}

const SubcontractorItem: React.FC<SubcontractorItemProps> = ({ subcontractor }) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="p-4 border rounded-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <h3 className="font-medium">{subcontractor.name}</h3>
        <Badge variant="outline">{subcontractor.frequency}</Badge>
      </div>
      {subcontractor.description && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Description:</span> {subcontractor.description}
        </div>
      )}
      <div className="mt-2 text-sm">
        <span className="text-muted-foreground">Cost:</span> {formatCurrency(subcontractor.cost)}
      </div>
      {subcontractor.service && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Service:</span> {subcontractor.service}
        </div>
      )}
      {subcontractor.email && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Email:</span> {subcontractor.email}
        </div>
      )}
      {subcontractor.phone && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Phone:</span> {subcontractor.phone}
        </div>
      )}
      {subcontractor.notes && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Notes:</span> {subcontractor.notes}
        </div>
      )}
    </div>
  );
};
