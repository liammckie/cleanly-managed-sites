
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote } from '@/lib/types/quotes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { QuoteStatusBadge } from './QuoteStatusBadge';

interface QuotesListProps {
  quotes: Quote[];
}

export function QuotesList({ quotes }: QuotesListProps) {
  const navigate = useNavigate();

  const handleRowClick = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };

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
          {quotes.map((quote) => (
            <TableRow 
              key={quote.id}
              className="cursor-pointer"
              onClick={() => handleRowClick(quote.id)}
            >
              <TableCell className="font-medium">{quote.name}</TableCell>
              <TableCell>{quote.clientName || quote.client_name}</TableCell>
              <TableCell>
                <QuoteStatusBadge status={quote.status} />
              </TableCell>
              <TableCell>
                {formatDate(quote.createdAt || quote.created_at)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(quote.totalPrice || quote.total_price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
