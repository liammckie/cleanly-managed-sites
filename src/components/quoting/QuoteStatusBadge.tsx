
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
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'approved':
      return <Badge variant="success">Approved</Badge>;
    case 'accepted':
      return <Badge variant="success">Accepted</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'expired':
      return <Badge variant="outline" className="text-muted-foreground">Expired</Badge>;
    case 'declined':
      return <Badge variant="destructive">Declined</Badge>;
    case 'submitted':
      return <Badge variant="secondary">Submitted</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
