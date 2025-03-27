
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { UserTable } from '@/components/users/UserTable';
import { NewUserDialog } from '@/components/users/NewUserDialog';
import { Loader2 } from 'lucide-react';
import { SystemUser } from '@/lib/types/users';
import { useRoles } from '@/hooks/useRoles';

export default function Users() {
  const { users, isLoading, error, refetch, createUserMutation } = useUsers();
  const { roles } = useRoles();
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  
  const handleOpenDialog = () => {
    setNewUserDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setNewUserDialogOpen(false);
  };
  
  const handleCreateUser = (userData: any) => {
    createUserMutation.mutate(userData);
    setNewUserDialogOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-destructive/10 p-4 rounded-md">
              <h3 className="text-destructive font-medium">An error occurred</h3>
              <p className="text-sm text-destructive/90 mt-2">{error.message}</p>
            </div>
            <Button onClick={() => refetch()} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const typedUsers = users as SystemUser[];
  
  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-2xl">Users</CardTitle>
          <Button onClick={handleOpenDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          {typedUsers && typedUsers.length > 0 ? (
            <UserTable users={typedUsers} />
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <NewUserDialog
        open={newUserDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleCreateUser}
        roles={roles || []}
        isSubmitting={createUserMutation.isPending}
        onOpenChange={setNewUserDialogOpen}
      />
    </div>
  );
}
