import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';
import { NewUserDialog } from '@/components/users/NewUserDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserRoleBadge } from '@/components/users/UserRoleBadge';
import { StatusBadge } from '@/components/users/StatusBadge';
import { formatDistanceToNow } from 'date-fns';

export default function Users() {
  const { users, isLoading, isError, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading users...</div>;
  }
  
  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }
  
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => 
        searchTerm === '' || 
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <div className="container py-6">
      <PageHeader 
        title="Users" 
        description="Manage your system users and permissions"
        action={
          <Button onClick={() => setIsNewUserDialogOpen(true)}>
            Add User
          </Button>
        }
      />
      
      <div className="mt-6 mb-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <Card 
            key={user.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/users/${user.id}`)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar_url || ''} alt={user.full_name} />
                    <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{user.full_name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
                <StatusBadge status={user.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <UserRoleBadge role={user.role} />
                </div>
                
                {user.title && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Title</span>
                    <span className="text-sm">{user.title}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last active</span>
                  <span className="text-sm">
                    {user.last_login ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true }) : 'Never'}
                  </span>
                </div>
                
                {user.territories && user.territories.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Territories</span>
                    <div className="flex flex-wrap gap-1">
                      {user.territories.map(territory => (
                        <Badge key={territory} variant="outline">
                          {territory}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found
        </div>
      )}
      
      <NewUserDialog 
        open={isNewUserDialogOpen} 
        onOpenChange={setIsNewUserDialogOpen} 
      />
    </div>
  );
}
