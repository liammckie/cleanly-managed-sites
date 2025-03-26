import React, { useState } from 'react';
import { useUsers, useCreateUser } from '@/hooks/useUsers';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Search, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NewUserDialog } from '@/components/users/NewUserDialog';
import { formatDate } from '@/lib/utils';

const Users = () => {
  const { data: users = [], isLoading } = useUsers();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'secondary';
      default:
        return 'default';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <PageHeader
        heading="Users"
        subheading="Manage system users and permissions"
        action={
          <Button onClick={() => setIsNewUserDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />
      
      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow 
                  key={user.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleUserClick(user.id)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.full_name} 
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                      )}
                      <div>
                        <div>{user.full_name}</div>
                        {user.title && (
                          <div className="text-xs text-muted-foreground">{user.title}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.last_login ? formatDate(user.last_login) : 'Never'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <NewUserDialog 
        open={isNewUserDialogOpen} 
        onOpenChange={setIsNewUserDialogOpen} 
      />
    </div>
  );
};

export default Users;
