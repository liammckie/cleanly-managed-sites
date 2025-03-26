
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserStatus } from '@/lib/types/userTypes';

interface StatusBadgeProps {
  status: UserStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let variant: "default" | "success" | "secondary" | "destructive" | "outline" = "default";
  
  // Determine the badge variant based on status
  switch (status) {
    case 'active':
      variant = "success";
      break;
    case 'pending':
      variant = "secondary";
      break;
    case 'inactive':
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }
  
  return <Badge variant={variant}>{status}</Badge>;
};
