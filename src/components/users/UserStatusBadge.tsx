
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserStatus } from '@/lib/types/users';

interface UserStatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  switch (status) {
    case 'active':
      return <Badge variant="success">Active</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'inactive':
      return <Badge variant="destructive">Inactive</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
