
import React from 'react';
import { SystemUser } from '@/lib/types/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface UserDetailsProps {
  user: SystemUser;
}

export function UserDetails({ user }: UserDetailsProps) {
  // Function to get initials from full name
  const getInitials = (name: string): string => {
    if (!name) return '';
    
    const parts = name.split(' ').filter(part => part.length > 0);
    
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name} />}
            <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{user.full_name}</h3>
            <p className="text-sm text-muted-foreground">{user.title || 'No title'}</p>
            <div className="mt-1">
              <Badge variant={user.status === 'active' ? 'default' : user.status === 'pending' ? 'outline' : 'destructive'}>
                {user.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
            <p>{user.email}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
            <p>{user.phone || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Role</h4>
            <p>{typeof user.role === 'object' ? user.role.name : user.role}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Login</h4>
            <p>{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</p>
          </div>
        </div>
        
        {user.territories && user.territories.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Territories</h4>
              <div className="flex flex-wrap gap-2">
                {user.territories.map((territory, index) => (
                  <Badge key={index} variant="outline">{territory}</Badge>
                ))}
              </div>
            </div>
          </>
        )}
        
        {user.notes && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
              <p className="text-sm">{user.notes}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
