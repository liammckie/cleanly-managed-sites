
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { SystemUser } from '@/lib/types';
import { format } from 'date-fns';

// Helper function to get initials from a name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

export interface UserDetailsProps {
  user: SystemUser;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function UserDetails({ user, onEdit, onDelete }: UserDetailsProps) {
  const handleEdit = () => {
    onEdit(user.id);
  };

  const handleDelete = () => {
    onDelete(user.id);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">{user.full_name || 'No Name'}</CardTitle>
          <div className="space-x-2">
            <Button onClick={handleEdit} size="sm" variant="outline">
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button onClick={handleDelete} size="sm" variant="outline" className="text-destructive">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'User'} />
              <AvatarFallback className="text-lg">{getInitials(user.full_name || '')}</AvatarFallback>
            </Avatar>
            <Badge variant={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'secondary'}>
              {user.status || 'Unknown'}
            </Badge>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <p>{user.phone || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                <p>{user.role?.name || 'No role assigned'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                <p>{user.title || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Login</h3>
                <p>{user.last_login ? format(new Date(user.last_login), 'PPp') : 'Never'}</p>
              </div>
            </div>
            
            {user.notes && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                <p className="text-sm mt-1">{user.notes}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
