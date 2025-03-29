import React, { useState, useEffect } from 'react';
import { useRoles } from '@/hooks/useRoles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { UserRole } from '@/types/db';
import { PlusCircle, Edit, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { DialogWhenEmpty } from '@/components/shared/DialogWhenEmpty';
import { Json } from '@/types/common';

import EditRoleDialog from './EditRoleDialog';
import DeleteRoleDialog from './DeleteRoleDialog';
import CreateRoleDialog from './CreateRoleDialog';

const convertJsonToPermissions = (jsonPermissions: Json): Record<string, boolean> => {
  if (typeof jsonPermissions === 'object' && jsonPermissions !== null && !Array.isArray(jsonPermissions)) {
    return Object.entries(jsonPermissions).reduce((acc, [key, value]) => {
      acc[key] = Boolean(value);
      return acc;
    }, {} as Record<string, boolean>);
  }
  return {};
};

export default function UserRolesList() {
  const { roles, isLoading, refetch } = useRoles();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    // This is a placeholder for real implementation
    // In a real app, you would fetch user counts for each role from the API
  }, [roles]);
  
  const handleCreateRole = () => {
    setIsCreateDialogOpen(true);
  };
  
  const handleEditRole = (role: any) => {
    const roleWithProperPermissions: UserRole = {
      ...role,
      permissions: convertJsonToPermissions(role.permissions)
    };
    setSelectedRole(roleWithProperPermissions);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteRole = (role: any) => {
    const roleWithProperPermissions: UserRole = {
      ...role,
      permissions: convertJsonToPermissions(role.permissions)
    };
    setSelectedRole(roleWithProperPermissions);
    setIsDeleteDialogOpen(true);
  };
  
  const handleRoleUpdated = () => {
    refetch();
    toast.success('Roles updated successfully');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Roles</h2>
        <Button onClick={handleCreateRole}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Role
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Roles</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : !roles || roles.length === 0 ? (
            <DialogWhenEmpty
              title="No roles found"
              description="Create your first role to manage user permissions."
              buttonText="Create Role"
              onAction={handleCreateRole}
              icon={<Users className="h-8 w-8 text-muted-foreground" />}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {role.description || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {(role as any).user_count || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <EditRoleDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        role={selectedRole}
        onRoleUpdated={handleRoleUpdated}
      />
      
      <DeleteRoleDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        role={selectedRole}
        onRoleDeleted={handleRoleUpdated}
      />
      
      <CreateRoleDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onRoleCreated={handleRoleUpdated}
      />
    </div>
  );
}
