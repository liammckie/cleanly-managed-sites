
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/lib/types/userTypes';

interface UserRoleBadgeProps {
  role: UserRole | string;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role }) => {
  // If role is a string, display it directly
  if (typeof role === 'string') {
    return <Badge variant="outline">{role}</Badge>;
  }
  
  // If role is a UserRole object, display its name
  return <Badge variant="outline">{role.name}</Badge>;
};
