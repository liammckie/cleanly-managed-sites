
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Plus, Shield } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { UserRoleDTO } from '@/types/dto';
import { EditRoleDialog } from './EditRoleDialog';
import { DeleteRoleDialog } from './DeleteRoleDialog';
import { CreateRoleDialog } from './CreateRoleDialog';

interface UserRolesListProps {
  roles: UserRoleDTO[];
  onEdit: (role: UserRoleDTO) => void;
  onDelete: (roleId: string) => void;
  onCreate: (role: Omit<UserRoleDTO, 'id'>) => void;
}

export function UserRolesList({ roles, onEdit, onDelete, onCreate }: UserRolesListProps) {
  const [editRoleDialogOpen, setEditRoleDialogOpen] = React.useState(false);
  const [createRoleDialogOpen, setCreateRoleDialogOpen] = React.useState(false);
  const [deleteRoleDialogOpen, setDeleteRoleDialogOpen] = React.useState(false);
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(null);

  const selectedRole = selectedRoleId 
    ? roles.find(role => role.id === selectedRoleId) 
    : null;

  const handleOpenEditDialog = (roleId: string) => {
    setSelectedRoleId(roleId);
    setEditRoleDialogOpen(true);
  };

  const handleOpenDeleteDialog = (roleId: string) => {
    setSelectedRoleId(roleId);
    setDeleteRoleDialogOpen(true);
  };

  const handleSaveRole = (updatedRole: UserRoleDTO) => {
    onEdit(updatedRole);
    setEditRoleDialogOpen(false);
  };

  const handleCreateRole = (newRole: Omit<UserRoleDTO, 'id'>) => {
    onCreate(newRole);
    setCreateRoleDialogOpen(false);
  };

  const handleDeleteRole = () => {
    if (selectedRoleId) {
      onDelete(selectedRoleId);
      setDeleteRoleDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">User Roles</h2>
        <Button onClick={() => setCreateRoleDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    {role.name}
                  </CardTitle>
                  {role.description && (
                    <CardDescription className="mt-1">{role.description}</CardDescription>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenEditDialog(role.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleOpenDeleteDialog(role.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Permissions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(role.permissions)
                      .filter(([_, hasPermission]) => hasPermission)
                      .map(([permission]) => (
                        <Badge key={permission} variant="outline">
                          {permission}
                        </Badge>
                      ))}
                    {Object.values(role.permissions).filter(Boolean).length === 0 && (
                      <span className="text-muted-foreground text-sm">No permissions assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 px-6 py-3">
              <div className="text-sm text-muted-foreground">
                {role.user_count !== undefined ? `${role.user_count} user${role.user_count !== 1 ? 's' : ''}` : 'No users'}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedRole && (
        <>
          <EditRoleDialog
            role={selectedRole}
            open={editRoleDialogOpen}
            onOpenChange={setEditRoleDialogOpen}
            onSave={handleSaveRole}
          />
          <DeleteRoleDialog
            roleName={selectedRole.name}
            open={deleteRoleDialogOpen}
            onOpenChange={setDeleteRoleDialogOpen}
            onDelete={handleDeleteRole}
          />
        </>
      )}

      <CreateRoleDialog
        open={createRoleDialogOpen}
        onOpenChange={setCreateRoleDialogOpen}
        onSave={handleCreateRole}
      />
    </div>
  );
}
