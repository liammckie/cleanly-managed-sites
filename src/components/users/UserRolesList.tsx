
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRoles } from '@/hooks/useRoles';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { UserRole } from '@/lib/types/users';
import NewRoleDialog from './NewRoleDialog';
import EditRoleDialog from './EditRoleDialog';

export function UserRolesList() {
  const { roles, isLoading, error, refetchRoles } = useRoles();
  const [isNewRoleDialogOpen, setIsNewRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  const handleEditRole = (role: UserRole) => {
    setSelectedRole(role);
    setIsEditRoleDialogOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4 text-red-500">
            <p>Error loading roles: {error.message}</p>
            <Button onClick={refetchRoles} className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>
              Manage user roles and permissions
            </CardDescription>
          </div>
          <Button onClick={() => setIsNewRoleDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Role
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles && roles.length > 0 ? (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || '-'}</TableCell>
                    <TableCell>{role.user_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No roles found. Create your first role to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Role Dialogs */}
      <NewRoleDialog 
        isOpen={isNewRoleDialogOpen}
        onClose={() => setIsNewRoleDialogOpen(false)}
        onRoleCreated={refetchRoles}
      />
      
      <EditRoleDialog 
        isOpen={isEditRoleDialogOpen}
        onClose={() => setIsEditRoleDialogOpen(false)}
        role={selectedRole}
        onRoleUpdated={refetchRoles}
      />
    </>
  );
}
