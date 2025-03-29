
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { QuoteStatus } from '@/types/common';

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
}

export function QuoteStatusBadge({ status }: QuoteStatusBadgeProps) {
  switch (status) {
    case 'draft':
      return <Badge variant="outline">Draft</Badge>;
    case 'sent':
      return <Badge variant="secondary">Sent</Badge>;
    case 'accepted':
      return <Badge variant="success">Accepted</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'expired':
      return <Badge variant="outline" className="text-muted-foreground">Expired</Badge>;
    case 'in-progress':
      return <Badge variant="warning">In Progress</Badge>;
    case 'completed':
      return <Badge variant="success">Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
