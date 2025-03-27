
import React, { useState } from 'react';
import { useRoles } from '@/hooks/useRoles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import NewRoleDialog from './NewRoleDialog';
import EditRoleDialog from './EditRoleDialog';
import { UserRole } from '@/lib/types/users';

function UserRolesList() {
  const { roles, isLoading, refetch } = useRoles();
  const [isNewRoleDialogOpen, setIsNewRoleDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  const handleRefresh = () => {
    refetch();
  };
  
  const handleEditRole = (role: UserRole) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Roles</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleRefresh()}>
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button variant="default" size="sm" onClick={() => setIsNewRoleDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            New Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles?.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEditClick={() => handleEditRole(role)}
            />
          ))}
        </div>
        
        <NewRoleDialog
          isOpen={isNewRoleDialogOpen}
          onClose={() => setIsNewRoleDialogOpen(false)}
          onRoleCreated={handleRefresh}
        />
        
        <EditRoleDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          role={selectedRole}
          onRoleUpdated={handleRefresh}
        />
      </CardContent>
    </Card>
  );
}

interface RoleCardProps {
  role: UserRole;
  onEditClick: () => void;
}

function RoleCard({ role, onEditClick }: RoleCardProps) {
  const permissionCount = Object.entries(role.permissions).filter(([_, value]) => value === true).length;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{role.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{role.description || 'No description'}</p>
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{permissionCount} permissions</span>
            <span>{role.user_count || 0} users</span>
          </div>
          
          <Button variant="outline" size="sm" className="mt-4 w-full" onClick={onEditClick}>
            Edit Role
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserRolesList;
