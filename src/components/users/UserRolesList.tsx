
import React, { useState } from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, UsersRound, ShieldCheck } from 'lucide-react';
import { NewRoleDialog } from './NewRoleDialog';
import { EditRoleDialog } from './EditRoleDialog';

export function UserRolesList() {
  const { roles, isLoading } = useUserRoles();
  const [showNewRoleDialog, setShowNewRoleDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-md w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  const handleEditRole = (roleId: string) => {
    setEditingRole(roleId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">System Roles</h2>
        <Button onClick={() => setShowNewRoleDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Role
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles?.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    {role.name}
                  </CardTitle>
                  <CardDescription>{role.description || 'No description available'}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEditRole(role.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-sm font-medium mb-2">Permissions:</h3>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission, index) => (
                  <Badge key={index} variant="secondary">
                    {permission}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="pt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <UsersRound className="mr-2 h-4 w-4" />
                <span>Users with this role: {role.userCount || 0}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <NewRoleDialog
        open={showNewRoleDialog}
        onOpenChange={setShowNewRoleDialog}
      />
      
      <EditRoleDialog
        roleId={editingRole}
        open={!!editingRole}
        onOpenChange={(open) => {
          if (!open) setEditingRole(null);
        }}
      />
    </div>
  );
}
