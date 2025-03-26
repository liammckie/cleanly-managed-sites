
import React from 'react';
import { 
  Card, 
  CardContent,
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PencilIcon, TrashIcon, ExternalLinkIcon } from 'lucide-react';
import { SystemUser } from '@/lib/types/users';

// Type-safe statuses for the badge variant
type BadgeVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'success';

// Map status to badge variant
const getStatusBadgeVariant = (status: string): BadgeVariant => {
  switch (status) {
    case 'active':
      return 'success';
    case 'pending':
      return 'secondary';
    case 'inactive':
      return 'outline';
    default:
      return 'outline';
  }
};

interface UserDetailsProps {
  user: SystemUser;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserDetails({ user, onEdit, onDelete }: UserDetailsProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">{user.full_name}</h2>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-2">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={`${user.first_name} ${user.last_name}`} 
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </div>
            )}
            <Badge variant={getStatusBadgeVariant(user.status)}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </Badge>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="flex items-center">
                  {user.email}
                  <a href={`mailto:${user.email}`} className="ml-1">
                    <ExternalLinkIcon className="h-3 w-3" />
                  </a>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                <p>{user.role_id ? user.role_id : 'No role assigned'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <p>{user.phone || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                <p>{user.title || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Login</h3>
                <p>{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Custom ID</h3>
                <p>{user.custom_id || 'None'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
              <p className="text-sm bg-muted p-3 rounded-md">
                {user.note || 'No notes available for this user.'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
