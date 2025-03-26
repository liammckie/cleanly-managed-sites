
import React from 'react';
import { Quote } from '@/lib/types/quotes';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

interface QuotesListProps {
  quotes: Quote[];
  onQuoteClick: (quoteId: string) => void;
}

export function QuotesList({ quotes, onQuoteClick }: QuotesListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map(quote => (
            <TableRow 
              key={quote.id} 
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => onQuoteClick(quote.id)}
            >
              <TableCell className="font-medium">{quote.name}</TableCell>
              <TableCell>{quote.client_name || quote.clientName}</TableCell>
              <TableCell>
                <StatusBadge status={quote.status} />
              </TableCell>
              <TableCell>{formatDate(quote.created_at || quote.createdAt, 'MMM d, yyyy')}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(quote.total_price || quote.totalPrice)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusColor = () => {
    switch (status) {
      case 'draft': return 'bg-gray-200 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };
  
  return (
    <Badge variant="outline" className={`${getStatusColor()} capitalize`}>
      {status}
    </Badge>
  );
}
