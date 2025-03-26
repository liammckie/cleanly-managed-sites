
import React from 'react';
import { SystemUser } from '@/lib/types/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';

interface UserDetailsProps {
  user: SystemUser;
  onEdit: () => void;
  onDelete: () => void;
}

// Helper function to get initials from a name
const getInitials = (name: string) => {
  if (!name) return '';
  
  const parts = name.split(' ').filter(part => part.length > 0);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

export function UserDetails({ user, onEdit, onDelete }: UserDetailsProps) {
  const userFullName = user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar_url} alt={userFullName} />
          <AvatarFallback>{getInitials(userFullName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <CardTitle className="text-xl">{userFullName}</CardTitle>
            <Badge variant="outline" className="capitalize mt-2 sm:mt-0">
              {user.status || 'Active'}
            </Badge>
          </div>
          <CardDescription className="mt-1">{user.title || 'Team Member'}</CardDescription>
          <CardDescription className="mt-1">{user.role && typeof user.role === 'object' ? user.role.name : user.role || ''}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="text-sm font-medium">{user.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Login</p>
            <p className="text-sm font-medium">
              {user.last_login ? formatDate(user.last_login, 'PPP') : 'Never'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="text-sm font-medium">
              {formatDate(user.created_at || '', 'PPP')}
            </p>
          </div>
        </div>

        {user.notes && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Notes</p>
            <p className="text-sm">{user.notes}</p>
          </div>
        )}

        {user.territories && user.territories.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Territories</p>
            <div className="flex flex-wrap gap-2">
              {user.territories.map((territory, index) => (
                <Badge key={index} variant="secondary">
                  {territory}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
