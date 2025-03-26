
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Quote } from '@/lib/types/quotes';
import { Edit, FileText, Printer, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface QuoteDetailsProps {
  quote: Quote;
}

export function QuoteDetails({ quote }: QuoteDetailsProps) {
  const navigate = useNavigate();
  
  // Handle missing properties by using either snake_case or camelCase versions
  const clientName = quote.clientName || quote.client_name || 'N/A';
  const siteName = quote.siteName || quote.site_name || 'N/A';
  const totalPrice = quote.totalPrice || quote.total_price || 0;
  const laborCost = quote.laborCost || quote.labor_cost || 0;
  const overheadCost = quote.overheadCost || quote.overhead_cost || 0;
  const subcontractorCost = quote.subcontractorCost || quote.subcontractor_cost || 0;
  const createdAt = quote.createdAt || quote.created_at || '';
  const startDate = quote.startDate || quote.start_date || '';
  const endDate = quote.endDate || quote.end_date || '';
  
  const handleEdit = () => {
    navigate(`/quotes/${quote.id}/edit`);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{quote.name}</h1>
          <p className="text-muted-foreground">
            Quote for {clientName} - {siteName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button onClick={handleEdit} size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quote Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Quote #</div>
              <div className="text-sm font-medium text-right">{quote.id.substring(0, 8)}</div>
              
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-right">
                <Badge variant="outline" className="capitalize">{quote.status}</Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="text-sm font-medium text-right">{formatDate(createdAt, 'MMM d, yyyy')}</div>
              
              <div className="text-sm text-muted-foreground">Valid Until</div>
              <div className="text-sm font-medium text-right">
                {quote.expiry_date ? formatDate(quote.expiry_date, 'MMM d, yyyy') : 'N/A'}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contract Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Start Date</div>
              <div className="text-sm font-medium text-right">
                {startDate ? formatDate(startDate, 'MMM d, yyyy') : 'N/A'}
              </div>
              
              <div className="text-sm text-muted-foreground">End Date</div>
              <div className="text-sm font-medium text-right">
                {endDate ? formatDate(endDate, 'MMM d, yyyy') : 'N/A'}
              </div>
              
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="text-sm font-medium text-right">
                {quote.contractLength ? `${quote.contractLength} ${quote.contractLengthUnit || 'months'}` : 'N/A'}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quote Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Labor Cost</div>
              <div className="text-sm font-medium text-right">{formatCurrency(laborCost)}</div>
              
              <div className="text-sm text-muted-foreground">Overhead</div>
              <div className="text-sm font-medium text-right">{formatCurrency(overheadCost)}</div>
              
              <div className="text-sm text-muted-foreground">Subcontractors</div>
              <div className="text-sm font-medium text-right">{formatCurrency(subcontractorCost)}</div>
              
              <Separator className="col-span-2 my-1" />
              
              <div className="text-sm font-medium">Total</div>
              <div className="text-lg font-bold text-right">{formatCurrency(totalPrice)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {quote.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{quote.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
